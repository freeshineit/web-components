import { LitElement, html, css } from 'lit'
import { customElement, property, state, query } from 'lit/decorators.js'

import '../button'

// https://lit.dev/docs/composition/component-composition/#passing-data-across-the-tree
@customElement('wc-input')
export class InputElement extends LitElement {
  static styles = css`
    :host([hidden]) {
      display: none;
    }
    :host {
      --primary-color-hover: #40a9ff;
      display: block;
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
      box-shadow: 0 0 0 2px var(--primary-color-outline);
      border-right-width: 1px;
      outline: 0;
    }
  `
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

  // firstUpdated() {
  //   console.log('wc-input firstUpdated')
  // }

  _keydown(e: InputEvent) {
    this.value = (e.target as HTMLInputElement).value
    // this.dispatchEvent(new Event('keydown'))
  }

  render() {
    return html`<input
      type=${this.type || null}
      name=${this.name || null}
      value=${this.value || null}
      placeholder=${this.placeholder || null}
      @keydown=${this._keydown}
    />`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-input': InputElement
  }
}
