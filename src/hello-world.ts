import { LitElement, html } from 'lit'
import { property, customElement } from 'lit/decorators.js'

@customElement('wc-hello-world')
export class HelloWorldElem extends LitElement {
  @property({ type: String }) title: string = 'default title'
  @property({ type: String }) description: string = 'default description'

  render() {
    // console.log("wc-hello-world");
    // https://tc39.es/proposal-template-literal-revision/
    return html`
      <style>
        .container {
          padding: 30px;
          text-align: center;
          background: #c8e7fd;
        }
        .container h1 {
          font-size: 50px;
        }
      </style>
      <div class="container">
        <h1>${this.title}</h1>
        <p>${this.description}</p>
      </div>
    `
  }
}
