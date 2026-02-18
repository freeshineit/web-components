import { WCBaseElement } from '@/core/base-element';
import { getStringAttr } from '@/utils/attrs';

export class WCOptionElement extends WCBaseElement {
  static get observedAttributes() {
    return ['value', 'label'];
  }

  get value(): string {
    return getStringAttr(this, 'value', this.textContent?.trim() ?? '');
  }

  set value(next: string) {
    this.setAttribute('value', next);
  }

  get label(): string {
    return getStringAttr(this, 'label', this.textContent?.trim() ?? '');
  }

  set label(next: string) {
    this.setAttribute('label', next);
  }

  protected template() {
    return `
      <style>
        :host {
          display: none;
        }
      </style>
      <slot></slot>
    `;
  }
}

customElements.define('wc-option', WCOptionElement);
