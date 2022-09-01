import dropdownStyle from './dropdown.scss'

function getStrAttribute (element: Dropdown, attr: string) {
  if (element.hasAttribute(attr)) {
    return String(element.getAttribute(attr))
  } else {
    return ''
  }
}

function getArrayAttribute (element: Dropdown, attr: string) {
  if (element.hasAttribute(attr)) {
    try {
      const arr = JSON.parse(String(element.getAttribute(attr)))
      return Array.isArray(arr) ? arr : []
    } catch (e) {
      console.log(e)
      return []
    }
  } else {
    return []
  }
}

export default class Dropdown extends HTMLElement {

  props: {
    name: string;
    value: string;
    placeholder: string;
    options: { name: string, value: string }[]
  }
  rootRef: HTMLElement | null
  menuRef: HTMLElement | null
  inputRef: HTMLInputElement | null
  resultRef: HTMLElement | null
  optionsRef: HTMLElement | null
  cursor: number

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    // Member functions
    this.setupOptions = this.setupOptions.bind(this)
    this.toggleMenu = this.toggleMenu.bind(this)
    this.expandMenu = this.expandMenu.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.isExpand = this.isExpand.bind(this)
    this.chooseOption = this.chooseOption.bind(this)

    // Refs
    this.props = {
      name: '',
      value: '',
      placeholder: '',
      options: []
    }
    this.rootRef = null
    this.menuRef = null
    this.inputRef = null
    this.resultRef = null
    this.optionsRef = null
    this.cursor = -1
  }

  connectedCallback () {
    if (this.shadowRoot !== null) {
      // Props
      this.props = {
        name: getStrAttribute(this, 'name'),
        value: getStrAttribute(this, 'value'),
        placeholder: getStrAttribute(this, 'placeholder'),
        options: getArrayAttribute(this, 'options')
      }

      // DOM
      this.shadowRoot.innerHTML = this.template(this.props)
      this.rootRef = this.shadowRoot.querySelector('.container')
      this.menuRef = this.shadowRoot.querySelector('.custom-select')
      this.inputRef = this.shadowRoot.querySelector('input')
      this.resultRef = this.shadowRoot.querySelector('.select-result')
      this.optionsRef = this.shadowRoot.querySelector('#optionsRef')
      this.setupOptions()

      // Style
      const styleElement = document.createElement('style')
      styleElement.appendChild(document.createTextNode(dropdownStyle))
      this.shadowRoot.appendChild(styleElement)

      // Events
      if (this.inputRef !== null) {
        this.inputRef.addEventListener('click', this.toggleMenu)
        this.inputRef.addEventListener('focus', this.focus)
        this.inputRef.addEventListener('keyup', this.handleKeyup)
        this.inputRef.addEventListener('keydown', this.handleKeydown)
      }
      if (this.rootRef !== null) {
        this.rootRef.addEventListener('blur', this.blur)
      }
    }
  }

  disconnectedCallback () {
  }

  setupOptions(): void {
    const _self = this
    if (_self.optionsRef !== null && Array.isArray(_self.props.options)) {
      _self.optionsRef.innerHTML = ''
      _self.props.options.forEach((option, index) => {
        const optionSpan = document.createElement('span')
        const optionDiv = document.createElement('div')
        optionSpan.setAttribute('data-index', String(index))
        optionSpan.textContent = option.name
        optionDiv.classList.add('select-option')
        optionDiv.setAttribute('value', option.value)
        optionDiv.setAttribute('data-index', String(index))
        optionDiv.appendChild(optionSpan)
        optionDiv.addEventListener('click', this.chooseOption)
        _self.optionsRef?.appendChild(optionDiv)
      })
    }
  }

  toggleMenu(): void {
    if (this.menuRef !== null) {
      if (this.menuRef.classList.contains('expand')) {
        this.hideMenu()
      } else {
        this.expandMenu()
      }
    }
  }

  expandMenu(): void {
    const menu = this.shadowRoot?.querySelector('.select-items')
    if (menu !== null && menu !== undefined) {
      menu.classList.remove('select-hide')
    }
    if (this.menuRef !== null) {
      this.menuRef.classList.add('expand')
    }
  }

  hideMenu(): void {
    const menu = this.shadowRoot?.querySelector('.select-items')
    if (menu !== null && menu !== undefined) {
      menu.classList.add('select-hide')
    }
    if (this.menuRef !== null) {
      this.menuRef.classList.remove('expand')
    }
  }

  focus(): void {
    if (this.rootRef !== null) {
      this.rootRef.focus()
    }
    if (this.menuRef !== null) {
      this.menuRef.classList.add('focused')
    }
  }

  blur(): void {
    this.hideMenu()
    if (this.menuRef !== null) {
      this.menuRef.classList.remove('focused')
    }
  }

  handleKeyup (e: KeyboardEvent) {
    if(e.key != "Tab") {
      e.preventDefault()
      if(e.key == " " || e.key == "Enter") {
        if (!this.isExpand()) {
          this.expandMenu()
        } else {
          if(this.cursor >= 0 && this.cursor < this.props.options.length) {
            this.setSelectedOption(this.cursor)
          }
          this.hideMenu()
        }
      } else if(e.key == "ArrowDown") {
        if (!this.isExpand()) {
          this.expandMenu()
        } else {
          this.setCursor((this.cursor + 1) % this.props.options.length)
        }
      } else if(e.key == "ArrowUp") {
        if (!this.isExpand()) {
          this.expandMenu()
        } else {
          this.setCursor((this.props.options.length + this.cursor - 1) % this.props.options.length)
        }
      } else if(e.key == "Escape") {
        this.hideMenu()
        this.cursor = -1
      } else if(e.key.match(/^[a-zA-Z0-9]$/)) {
        if(Array.isArray(this.props.options)) {
          let option_cursor = this.cursor
          let found = this.props.options.findIndex(function(element, index) {
            return element.name.toUpperCase().startsWith(e.key.toUpperCase()) && index > option_cursor
          })
          if(found < 0) {
            found = this.props.options.findIndex(function(element, index) {
              return element.name.toUpperCase().startsWith(e.key.toUpperCase())
            })
          }
          if(found >= 0) {
            this.scrollToIndex(found)
            this.setCursor(found)
          }
        }
      }
    } else {
      this.hideMenu()
    }
  }

  handleKeydown(e: KeyboardEvent) {
    if(e.key != "Tab") {
      e.preventDefault()
    }
  }

  isExpand() {
    return this.menuRef !== null && this.menuRef.classList.contains('expand')
  }

  chooseOption(e: Event) {
    const el = e.target as HTMLElement
    if (el.hasAttribute('data-index')) {
      this.setSelectedOption(parseInt(String(el.getAttribute('data-index'))))
    }
  }

  setSelectedOption(cursor: number) {
    // TODO
    if (!isNaN(cursor) && cursor >= 0 && cursor < this.props.options.length) {
      if (this.inputRef !== null) {
        this.inputRef.value = this.props.options[cursor].value
      }
      if (this.resultRef !== null) {
        this.resultRef.classList.remove('placeholder')
        this.resultRef.textContent = this.props.options[cursor].name
        this.hideMenu()
      }
    }
  }

  scrollToIndex(index: number) {
    // TODO
    console.log("scrollTo", index)
  }

  setCursor(index: number) {
    if (index >= 0 && Array.isArray(this.props.options) && index < this.props.options.length) {
      this.cursor = index
      console.log("cursorTo", index)
    }
  }

  template(data: {name: string; value: string; placeholder: string;}) {
    return `
      <div class="container" tabindex="0">
        <input
          placeholder="${data.placeholder}
          type="text"
          class="custom replaced custom-select-input"
          name="${data.name}"
          value="${data.value}"
          readonly="readonly"
          style="z-index: 10"
        />
        <div class="custom-select">
          <div class="select-result form-control placeholder">
            ${data.placeholder}
          </div>
          <div id="optionsRef" class="shadow-sm select-items select-hide">
          </div>
        </div>
      </div>
    `
  }
}

window.customElements.define('dropdown-menu', Dropdown)
