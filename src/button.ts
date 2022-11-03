import { LitElement, html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'
// 内置指令
import { classMap } from 'lit/directives/class-map.js'

@customElement('wc-button')
export class ButtonElem extends LitElement {
  static styles = css`
    button {
      color: #0099e5;
      border: 1px solid #0099e5;
      border-radius: 0px;
      background-color: #fff;
      padding: 5px 12px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    button:hover {
      background-color: #0099e5;
      color: #fff;
    }
  `

  @property({ type: String })
  title: string = 'button title'

  @property({ type: String })
  class: string = 'classname'

  firstUpdated() {
    console.log('wc-button firstUpdated')
  }

  //TODO: click event
  _click(event: any) {
    console.log(event)
  }

  render() {
    const classes = { enabled: this.class, hidden: false }

    return html`<button class="${classMap(classes)}" @click=${this._click}>
      ${this.title}
      <slot></slot>
    </button> `
  }
}
