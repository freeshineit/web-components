import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

import '../button'

// https://lit.dev/docs/composition/component-composition/#passing-data-across-the-tree
// https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example 表单关联值
// https://web.dev/more-capable-form-controls/
// https://css-tricks.com/creating-custom-form-controls-with-elementinternals/
@customElement('wc-input')
export class WCInputElement extends LitElement {
  static get formAssociated() {
    return true
  }

  static styles = css`
    :host {
      --primary-color-hover: #40a9ff;
      display: block;
    }

    :host([hidden]) {
      display: none;
    }

    input {
      box-sizing: border-box;
      margin: 0;
      list-style: none;
      position: relative;
      display: inline-block;
      width: 100%;
      min-width: 0;
      padding: 4px 11px;
      color: #000000d9;
      font-size: 14px;
      line-height: 1.5715;
      background-color: #fff;
      background-image: none;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      transition: all 0.3s;
    }
    input:focus {
      border-color: var(--primary-color-hover);
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      border-right-width: 1px;
      outline: 0;
    }

    input:hover {
      border-color: var(--primary-color-hover);
      border-right-width: 1px;
      outline: 0;
    }
  `

  private _internals: any

  constructor() {
    super()
    this._internals = this.attachInternals()
  }

  @property({ reflect: true, type: String })
  type: 'text' | 'number' | 'hidden' | 'tel' | 'url' | 'password' | 'email' =
    'text'

  @property({ reflect: true })
  name: string = ''

  @property({ type: String })
  value: string = ''

  @property({ type: String })
  placeholder: string = ''

  // @state()
  // _submitEnabled = false
  @query('input')
  _input!: HTMLInputElement

  firstUpdated() {
    /** This ensures our element always participates in the form */
    this._internals.setFormValue(this.value)
  }

  _onKeydown(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value
    // this.dispatchEvent(new Event('keydown'))
  }

  _onInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value
    this._internals.setFormValue(this.value)
  }

  render() {
    return html`<input
      type=${this.type || null}
      name=${this.name || null}
      value=${this.value || null}
      placeholder=${this.placeholder || null}
      @keydown=${this._onKeydown}
      @input=${this._onInput}
    />`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-input': WCInputElement
  }
}
