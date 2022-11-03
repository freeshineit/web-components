import { LitElement, html } from 'lit'
import { property, customElement } from 'lit/decorators.js'

@customElement('wc-list')
export class ListElem extends LitElement {
  // converter
  @property({ type: Array, converter: v => JSON.parse(v as string) })
  colors = ['red', 'green', 'blue'] // 默认值

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
