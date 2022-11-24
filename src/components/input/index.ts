import { LitElement, html } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'
import style from './input.scss'

import '../button'

// https://lit.dev/docs/composition/component-composition/#passing-data-across-the-tree
// https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-face-example 表单关联值
// https://web.dev/more-capable-form-controls/
// https://css-tricks.com/creating-custom-form-controls-with-elementinternals/
@customElement('wc-input')
export class WCInputElement extends LitElement {
  static formAssociated = true

  static styles = [style]

  private _internals: any

  constructor() {
    super()
    // jsdom 环境下 `attachInternals()` 报错
    // 兼容
    this._internals = this?.attachInternals
      ? this?.attachInternals()
      : ({} as ElementInternals)
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
    this._internals?.setFormValue(this.value)
  }

  _onKeydown(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value
    // this.dispatchEvent(new Event('keydown'))
  }

  _onInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value
    this._internals?.setFormValue(this.value)
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

export interface HTMLElementTagNameMap {
  'wc-input': WCInputElement
}
