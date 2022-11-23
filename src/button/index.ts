import { LitElement, html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
// 内置指令
import { classMap } from 'lit/directives/class-map.js'

// https://www.w3.org/TR/2011/WD-html5-20110525/association-of-controls-and-forms.html
@customElement('wc-button')
export class WCButtonElement extends LitElement {
  static formAssociated = true

  static styles = css`
    button {
      line-height: 1.5715;
      position: relative;
      display: inline-block;
      font-weight: 400;
      white-space: nowrap;
      text-align: center;
      background-image: none;
      border: 1px solid transparent;
      box-shadow: 0 2px #00000004;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      touch-action: manipulation;
      height: 32px;
      padding: 4px 15px;
      font-size: 14px;
      border-radius: 2px;
      color: #000000d9;
      border-color: #d9d9d9;
      background: #fff;
    }

    button:hover {
      border-color: #1890ff;
      color: #1890ff;
    }
  `

  @property({ type: String })
  title: string = 'button title'

  @property({ type: String })
  class: string = 'classname'

  @property({ type: String })
  type: 'button' | 'submit' | 'reset' = 'button'

  private _internals: ElementInternals | null

  constructor() {
    super()
    // jsdom 环境下 `attachInternals()` 报错
    // 兼容
    this._internals = this?.attachInternals
      ? this?.attachInternals()
      : ({} as ElementInternals)
  }

  firstUpdated() {
    // this._internals?.submitButton = true
  }

  //TODO: click event
  _click(event: any) {
    console.log(event)

    // form submit
    const formId = this.getAttribute('form')
    const form = (
      formId ? document.getElementById(formId) : this.closest('form')
    ) as HTMLFormElement

    if (form) {
      switch (this.getAttribute('type')) {
        case 'reset':
          form.reset()
          break
        default:
          form.requestSubmit()
          break
      }
    }
  }

  render() {
    const classes = { enabled: this.class, hidden: false }

    return html`<button
      class="${classMap(classes)}"
      @click=${this._click}
      type=${this.type || null}
    >
      <slot></slot>
    </button> `
  }
}

export interface HTMLElementTagNameMap {
  'wc-button': WCButtonElement
}
