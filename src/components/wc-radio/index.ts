import { WCBaseElement } from '@/core/base-element';
import { getBooleanAttr, getStringAttr, setBooleanAttr } from '@/utils/attrs';

export class WCRadioElement extends WCBaseElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'name', 'value'];
  }

  private get inputEl(): HTMLInputElement | null {
    return this.shadow.querySelector('input[type="radio"]');
  }

  get checked(): boolean {
    return this.inputEl?.checked ?? getBooleanAttr(this, 'checked');
  }

  set checked(next: boolean) {
    setBooleanAttr(this, 'checked', next);
    const input = this.inputEl;
    if (input) input.checked = next;
  }

  protected onAttrChange(name: string) {
    const input = this.inputEl;
    if (!input) {
      this.render();
      return;
    }

    if (name === 'checked') {
      input.checked = getBooleanAttr(this, 'checked');
      return;
    }

    if (name === 'disabled') {
      input.disabled = getBooleanAttr(this, 'disabled');
      return;
    }

    this.render();
  }

  protected template() {
    const checked = getBooleanAttr(this, 'checked');
    const disabled = getBooleanAttr(this, 'disabled');
    const name = getStringAttr(this, 'name', '');
    const value = getStringAttr(this, 'value', 'on');

    return `
      <style>
      
      :host {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-family: var(--wc-font-family);
        color: var(--wc-text);
        cursor: pointer;
        user-select: none;
      }

      label {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
      }

      .wc-radio-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      input[type='radio'] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
        cursor: inherit;
      }

      .wc-radio-dot {
        position: absolute;
        width: 16px;
        height: 16px;
        border: 1px solid var(--wc-border);
        border-radius: 50%;
        background: var(--wc-bg);
        transition: all 0.2s ease;
        pointer-events: none;
      }

      input[type='radio']:checked + .wc-radio-dot {
        border-color: var(--wc-primary);
        background: var(--wc-primary);
      }

      .wc-radio-dot::after {
        content: '';
        position: absolute;
        width: 6px;
        height: 6px;
        background: #fff;
        border-radius: 50%;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      input[type='radio']:checked + .wc-radio-dot::after {
        opacity: 1;
      }

      input[type='radio']:focus + .wc-radio-dot {
        box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.15);
        outline: none;
      }

      input[type='radio']:disabled + .wc-radio-dot {
        border-color: var(--wc-border);
        background: var(--wc-surface);
        cursor: not-allowed;
      }

      input[type='radio']:disabled:checked + .wc-radio-dot {
        background: var(--wc-disabled);
        border-color: var(--wc-disabled);
      }

      :host([disabled]) {
        cursor: not-allowed;
      }

      :host([disabled]) label {
        cursor: not-allowed;
        color: var(--wc-disabled);
      }
      </style>
      <label>
        <div class="wc-radio-wrapper">
          <input
            type="radio"
            ${checked ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}
            ${name ? `name="${name}"` : ''}
            value="${value}"
          />
          <div class="wc-radio-dot"></div>
        </div>
        <slot></slot>
      </label>
    `;
  }

  protected afterRender() {
    const input = this.inputEl;
    if (!input) return;

    // Remove old listeners to prevent duplicates
    input.removeEventListener('change', this.handleChange);
    input.removeEventListener('click', this.handleClick);

    input.addEventListener('change', this.handleChange);
    input.addEventListener('click', this.handleClick);
  }

  private handleChange = () => {
    const input = this.inputEl;
    if (!input) return;

    // Always update checked state
    setBooleanAttr(this, 'checked', input.checked);

    if (input.checked) {
      this.uncheckSiblings();
    }

    this.emit('change', {
      name: getStringAttr(this, 'name', ''),
      value: getStringAttr(this, 'value', 'on'),
      checked: input.checked,
      type: 'radio',
    });
  };

  private handleClick = () => {
    const input = this.inputEl;
    if (!input || input.disabled) return;

    // Ensure checked state is reflected in attribute for consistency
    if (input.checked) {
      setBooleanAttr(this, 'checked', true);
    }
  };

  private uncheckSiblings() {
    const name = getStringAttr(this, 'name', '');
    if (!name) return;

    const root = this.getRootNode() as Document | ShadowRoot;
    const radios = root.querySelectorAll('wc-radio');

    radios.forEach(node => {
      if (node !== this && node.getAttribute('name') === name) {
        node.removeAttribute('checked');
        const input = node.shadowRoot?.querySelector('input[type="radio"]') as HTMLInputElement | null;
        if (input) {
          input.checked = false;
        }
      }
    });
  }

  disconnectedCallback() {
    const input = this.inputEl;
    if (input) {
      input.removeEventListener('change', this.handleChange);
      input.removeEventListener('click', this.handleClick);
    }
  }
}

customElements.define('wc-radio', WCRadioElement);
