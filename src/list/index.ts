import { LitElement, html } from 'lit'
import { property, customElement } from 'lit/decorators.js'
import style from './list.scss'
@customElement('wc-list')
export class WCListElement extends LitElement {
  static styles = [style]

  // converter
  @property({
    type: Array,
    converter: function (v: string): Array<string> {
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

export interface HTMLElementTagNameMap {
  'wc-list': WCListElement
}
