import { LitElement, html, css } from 'lit'
import { property, customElement } from 'lit/decorators.js'

@customElement('wc-list')
export class WCListElement extends LitElement {
  static styles = css`
    ul,
    li {
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      list-style: none;
    }

    li {
      height: 32px;
      line-height: 32px;
    }
  `

  // converter
  @property({
    type: Array,
    converter: v => {
      try {
        const arr = JSON.parse(v as string)
        if (Array.isArray(arr)) {
          return arr
        }
        return []
      } catch (error) {
        return []
      }
    },
  })
  colors = [] // 默认值

  firstUpdated() {
    console.log('wc-list firstUpdated')
    // Fetch Api
  }

  render() {
    return html`<ul>
      ${this.colors.map(
        color => html`<li style="color: ${color}">${color}</li>`
      )}
    </ul> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wc-list': WCListElement
  }
}
