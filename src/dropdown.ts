import dropdownStyle from './dropdown.scss'

function getIntAttribute (element: Dropdown, attr: string) {
  if (element.hasAttribute(attr)) {
    const num = parseInt(String(element.getAttribute(attr)))
    return isNaN(num) ? 0 : num
  } else {
    return 0
  }
}

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

  #props: {
    name: string
    value: string
    placeholder: string
    options: { name: string, value: string }[]
    startitem: number
    maxitems: number
  }
  #rootRef: HTMLElement | null
  #menuRef: HTMLElement | null
  #inputRef: HTMLInputElement | null
  #resultRef: HTMLElement | null
  #optionsRef: HTMLElement | null
  #realInputRef: HTMLInputElement | null
  #cursor: number
  #scrollIndex: number
  #selectIndex: number

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    // Member functions
    this.toggleMenu = this.toggleMenu.bind(this)
    this.expandMenu = this.expandMenu.bind(this)
    this.hideMenu = this.hideMenu.bind(this)
    this.handlefocus = this.handlefocus.bind(this)
    this.handleblur = this.handleblur.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
    this.chooseOption = this.chooseOption.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)

    // Refs
    this.#props = {
      name: '',
      value: '',
      placeholder: '',
      options: [],
      startitem: 0,
      maxitems: 0
    }
    this.#rootRef = null
    this.#menuRef = null
    this.#inputRef = null
    this.#resultRef = null
    this.#optionsRef = null
    this.#realInputRef = null
    this.#cursor = -1
    this.#scrollIndex = 0
    this.#selectIndex = -1
  }

  connectedCallback () {
    if (this.shadowRoot !== null) {
      // Props
      this.#props = {
        name: getStrAttribute(this, 'name'),
        value: getStrAttribute(this, 'value'),
        placeholder: getStrAttribute(this, 'placeholder'),
        options: getArrayAttribute(this, 'options'),
        startitem: getIntAttribute(this, 'startitem'),
        maxitems: getIntAttribute(this, 'maxitems')
      }

      // DOM
      this.shadowRoot.innerHTML = this.template(this.#props)
      this.#rootRef = this.shadowRoot.querySelector('.container')
      this.#menuRef = this.shadowRoot.querySelector('.custom-select')
      this.#inputRef = this.shadowRoot.querySelector('input')
      this.#resultRef = this.shadowRoot.querySelector('.result-text')
      this.#optionsRef = this.shadowRoot.querySelector('#optionsRef')
      this.#setupOptions()
      this.#realInputRef = document.createElement('input')
      this.#realInputRef.type = 'hidden'
      this.#realInputRef.name = this.#props.name
      this.appendChild(this.#realInputRef)

      // Style
      const styleElement = document.createElement('style')
      styleElement.appendChild(document.createTextNode(dropdownStyle))
      this.shadowRoot.appendChild(styleElement)

      // Events
      if (this.#inputRef !== null) {
        this.#inputRef.addEventListener('click', this.toggleMenu)
        this.#inputRef.addEventListener('focus', this.handlefocus)
        this.#inputRef.addEventListener('keyup', this.handleKeyup)
        this.#inputRef.addEventListener('keydown', this.handleKeydown)
      }
      if (this.#rootRef !== null) {
        this.#rootRef.addEventListener('blur', this.handleblur)
        this.#rootRef.addEventListener('keyup', this.handleKeyup)
        this.#rootRef.addEventListener('keydown', this.handleKeydown)
      }
    }
  }

  disconnectedCallback () {
  }

  #setupOptions(): void {
    const _self = this
    if (_self.#optionsRef !== null && Array.isArray(_self.#props.options)) {
      _self.#optionsRef.innerHTML = ''
      _self.#cursor = -1
      _self.#scrollIndex = 0
      _self.#selectIndex = -1
      _self.#props.options.forEach((option, index) => {
        const optionSpan = document.createElement('span')
        const optionDiv = document.createElement('div')
        optionSpan.setAttribute('data-index', String(index))
        optionSpan.textContent = option.name
        optionDiv.classList.add('select-option')
        optionDiv.setAttribute('value', option.value)
        optionDiv.setAttribute('data-index', String(index))
        optionDiv.appendChild(optionSpan)
        optionDiv.addEventListener('click', this.chooseOption)
        optionDiv.addEventListener('mouseenter', this.mouseEnter)
        _self.#optionsRef?.appendChild(optionDiv)
      })
    }
  }

  toggleMenu(): void {
    if (this.#menuRef !== null) {
      if (this.#menuRef.classList.contains('expand')) {
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
    if (this.#menuRef !== null) {
      this.#menuRef.classList.add('expand')
    }
    if (this.#optionsRef !== null) {
      if (!this.#isScrollable()) {
        this.#optionsRef.style.overflowY = 'hidden'
      }
      if (this.#menuHeight() > 0) {
        this.#optionsRef.style.height = `${this.#menuHeight()}px`
      }
    }
  }

  hideMenu(): void {
    const menu = this.shadowRoot?.querySelector('.select-items')
    if (menu !== null && menu !== undefined) {
      menu.classList.add('select-hide')
    }
    if (this.#menuRef !== null) {
      this.#menuRef.classList.remove('expand')
    }
  }

  handlefocus(): void {
    if (this.#rootRef !== null) {
      this.#rootRef.focus()
    }
    if (this.#menuRef !== null) {
      this.#menuRef.classList.add('focused')
    }
  }

  handleblur(e: FocusEvent): void {
    if (this.shadowRoot !== null) {
      const target = e.relatedTarget as Node | null
      if (!this.shadowRoot.contains(target)) {
        this.hideMenu()
        if (this.#menuRef !== null) {
          this.#menuRef.classList.remove('focused')
        }
      }
    }
  }

  handleKeyup (e: KeyboardEvent) {
    if(e.key != "Tab") {
      e.preventDefault()
    }
  }

  handleKeydown(e: KeyboardEvent) {
    if(e.key != "Tab") {
      e.preventDefault()
      if(e.key == " " || e.key == "Enter") {
        if (!this.#isExpand()) {
          this.expandMenu()
          if (this.#selectIndex >= 0) {
            // this.#setCursor(this.#selectIndex)
            this.#cursor = this.#selectIndex
          } else {
            this.#setCursor(0)
          }
        } else {
          if(this.#cursor >= 0 && this.#cursor < this.#props.options.length) {
            this.setSelectedOption(this.#cursor)
          }
          this.hideMenu()
        }
      } else if(e.key == "ArrowDown") {
        if (!this.#isExpand()) {
          this.expandMenu()
          if (this.#selectIndex >= 0) {
            // this.#setCursor(this.#selectIndex)
            this.#cursor = this.#selectIndex
          } else {
            this.#setCursor(0)
          }
        } else {
          this.#setCursor( (this.#cursor + 1) % this.#props.options.length)
        }
      } else if(e.key == "ArrowUp") {
        if (!this.#isExpand()) {
          this.expandMenu()
          if (this.#selectIndex >= 0) {
            // this.#setCursor(this.#selectIndex)
            this.#cursor = this.#selectIndex
          } else {
            this.#setCursor(0)
          }
        } else {
          this.#setCursor((this.#props.options.length + this.#cursor - 1) % this.#props.options.length)
        }
      } else if(e.key == "Escape") {
        this.hideMenu()
        this.#cursor = -1
      } else if(e.key.match(/^[a-zA-Z0-9]$/)) {
        if(Array.isArray(this.#props.options)) {
          let option_cursor = this.#cursor
          let found = this.#props.options.findIndex(function(element, index) {
            return element.name.toUpperCase().startsWith(e.key.toUpperCase()) && index > option_cursor
          })
          if(found < 0) {
            found = this.#props.options.findIndex(function(element, index) {
              return element.name.toUpperCase().startsWith(e.key.toUpperCase())
            })
          }
          if(found >= 0) {
            this.#scrollToIndex(found)
            this.#setCursor(found)
          }
        }
      }
    } else {
      this.hideMenu()
    }
  }

  #isExpand() {
    return this.#menuRef !== null && this.#menuRef.classList.contains('expand')
  }

  #isScrollable() {
    return this.#props.maxitems > 0 && this.#props.maxitems < this.#props.options.length
  }

  #singleOptionHeight () {
    if (this.#props.options.length > 0 && this.#rootRef !== null) {
      const element = this.#rootRef.querySelector('.select-option')
      if (element !== null) {
        const style = window.getComputedStyle(element)
        const singleOptionHeight =
          Number(style.height.replace('px', '')) +
          Number(style.paddingTop.replace('px', '')) +
          Number(style.paddingBottom.replace('px', '')) +
          Number(style.borderTopWidth.replace('px', '')) +
          Number(style.borderBottomWidth.replace('px', ''))
          return singleOptionHeight
      }
    }
    return 0
  }

  #menuHeight () {
    const singleOptionHeight = this.#singleOptionHeight()
    if (this.#props.maxitems > 0 && this.#props.maxitems <= this.#props.options.length) {
      return this.#props.maxitems * singleOptionHeight
    } else {
      return this.#props.options.length * singleOptionHeight
    }
  }

  chooseOption(e: Event) {
    const el = e.target as HTMLElement
    if (el.hasAttribute('data-index')) {
      this.setSelectedOption(parseInt(String(el.getAttribute('data-index'))))
    }
  }

  mouseEnter(e: Event) {
    const el = e.target as HTMLElement
    if (el.hasAttribute('data-index')) {
      const index = parseInt(String(el.getAttribute('data-index')))
      if (index >= 0 && Array.isArray(this.#props.options) && index < this.#props.options.length) {
        this.#cursor = index
        const prevCursored = this.shadowRoot?.querySelector('.select-option.hover')
        if (prevCursored !== null && prevCursored !== undefined) {
          prevCursored.classList.remove('hover')
        }
        const option = this.shadowRoot?.querySelector(`.select-option[data-index="${this.#cursor}"]`)
        if (option !== null && option !== undefined) {
          option.classList.add('hover')
        }
      }
    }
  }

  setSelectedOption(cursor: number) {
    if (!isNaN(cursor) && cursor >= 0 && cursor < this.#props.options.length) {
      this.#selectIndex = cursor
      if (this.#inputRef !== null) {
        this.#inputRef.value = this.#props.options[cursor].value
      }
      if (this.#resultRef !== null) {
        this.#resultRef.classList.remove('placeholder')
        this.#resultRef.textContent = this.#props.options[cursor].name
        this.hideMenu()
      }
      if (this.#realInputRef !== null) {
        this.#realInputRef.value = this.#props.options[cursor].value
      }
      const prevSelected = this.shadowRoot?.querySelector('.select-selected')
      if (prevSelected !== null && prevSelected !== undefined) {
        prevSelected.classList.remove('select-selected')
      }
      const option = this.shadowRoot?.querySelector(`.select-option[data-index="${cursor}"]`)
      if (option !== null && option !== undefined) {
        option.classList.add('select-selected')
      }
    }
  }

  #scrollToIndex(index: number) {
    if (index >= 0 && Array.isArray(this.#props.options) && index < this.#props.options.length) {
      this.#scrollIndex = index
      if (this.#optionsRef !== null) {
        this.#optionsRef.scrollTop = this.#scrollIndex * this.#singleOptionHeight()
      }
    }
  }

  #setCursor(index: number) {
    if (index >= 0 && Array.isArray(this.#props.options) && index < this.#props.options.length) {
      this.#cursor = index
      const prevCursored = this.shadowRoot?.querySelector('.select-option.hover')
      if (prevCursored !== null && prevCursored !== undefined) {
        prevCursored.classList.remove('hover')
      }
      const option = this.shadowRoot?.querySelector(`.select-option[data-index="${this.#cursor}"]`)
      if (option !== null && option !== undefined) {
        option.classList.add('hover')
      }
      if (this.#isScrollable()) {
        if (this.#cursor == this.#scrollIndex + this.#props.maxitems) {
          this.#scrollToIndex(this.#scrollIndex + 1)
        } else if (this.#cursor < this.#scrollIndex) {
          this.#scrollToIndex(this.#cursor)
        } else if (this.#cursor > this.#scrollIndex + this.#props.maxitems) {
          this.#scrollToIndex(this.#cursor)
        }
      }
    }
  }

  set options (options) {
    if (Array.isArray(options)) {
      this.#props.options = options
      this.#selectIndex = -1
      if (this.#resultRef !== null) {
        this.#resultRef.textContent = this.#props.placeholder
        this.#resultRef.classList.add('placeholder')
      }
      if (this.#realInputRef !== null) {
        this.#realInputRef.value = ''
      }
      this.#setupOptions()
    }
  }

  get options () {
    return this.#props.options
  }

  get value () {
    if (this.#selectIndex >= 0 && this.#selectIndex in this.#props.options) {
      if (typeof this.#props.options[this.#selectIndex].value === 'string') {
        return this.#props.options[this.#selectIndex].value
      }
    }
    return ''
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
          <div class="select-result form-control">
            <span class="result-text placeholder">${data.placeholder}</span>
            <i class="chevron"></i>
          </div>
          <div id="optionsRef" class="shadow-sm select-items select-hide">
          </div>
        </div>
      </div>
    `
  }
}
