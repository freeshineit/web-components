import { LitElement, html } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("wc-button")
export class ButtonElem extends LitElement {
  @property({ type: String }) title: string = "button title";

  render() {
    console.log("wc-button");
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
      <button class="container">
        <h1>${this.title}</h1>
      </button>
    `;
  }
}
