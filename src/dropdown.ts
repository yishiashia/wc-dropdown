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
  inputRef: HTMLElement | null
  resultRef: HTMLElement | null
  optionsRef: HTMLElement | null

  constructor () {
    super()
    this.attachShadow({ mode: 'open' })

    // Member functions
    this.setupOptions = this.setupOptions.bind(this)
    this.expandMenu = this.expandMenu.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.mouseEnter = this.mouseEnter.bind(this)
    this.mouseLeave = this.mouseLeave.bind(this)
    this.handleKeyup = this.handleKeyup.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)

    // Refs
    this.props = {
      name: '',
      value: '',
      placeholder: '',
      options: []
    }
    this.inputRef = null
    this.resultRef = null
    this.optionsRef = null
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
      this.inputRef = this.shadowRoot.querySelector('input')
      this.resultRef = this.shadowRoot.querySelector('.select-selected')
      this.optionsRef = this.shadowRoot.querySelector('#optionsRef')
      this.setupOptions()

      // Style
      const styleElement = document.createElement('style')
      styleElement.appendChild(document.createTextNode(dropdownStyle))
      this.shadowRoot.appendChild(styleElement)

      // Events
      if (this.inputRef !== null) {
        this.inputRef.addEventListener('click', this.expandMenu)
        this.inputRef.addEventListener('focus', this.focus)
        this.inputRef.addEventListener('blur', this.blur)
        this.inputRef.addEventListener('mouseenter', this.mouseEnter)
        this.inputRef.addEventListener('mouseleave', this.mouseLeave)
        this.inputRef.addEventListener('keyup', this.handleKeyup)
        this.inputRef.addEventListener('keydown', this.handleKeydown)
      }
      if (this.resultRef !== null) {
        this.resultRef.addEventListener('click', this.expandMenu)
      }
    }
  }

  disconnectedCallback () {
  }

  setupOptions(): void {
    if (this.optionsRef !== null && Array.isArray(this.props.options)) {
      this.optionsRef.innerHTML = this.props.options.map(
        (option, index) =>`
          <div class="select-option" value="${option.value}" data-index="${index}">
            <span data-index="${index}">${option.name}</span>
          </div>
        `
      ).join('')
    }
  }

  expandMenu(): void {
    const menu = this.shadowRoot?.querySelector('.select-items')
    if (menu !== null && menu !== undefined) {
      menu.classList.remove('select-hide')
    }
  }

  focus(): void {

  }

  blur(): void {

  }

  mouseEnter () {

  }

  mouseLeave () {

  }

  handleKeyup () {

  }

  handleKeydown () {

  }

  template(data: {name: string; value: string; placeholder: string;}) {
    return `
      <div class="container">
        <input
          type="text"
          class="custom replaced custom-select-input"
          name=${data.name}
          value=${data.value}
          readonly="readonly"
          style="z-index: 10"
        />
        <div class="custom-select">
          <div class="select-selected form-control select-arrow-active">
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
