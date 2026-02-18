import { WCBaseElement } from '@/core/base-element'
import { getBooleanAttr, getStringAttr, setBooleanAttr } from '@/utils/attrs'

export class WCCheckboxElement extends WCBaseElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'name', 'value']
  }

  private get inputEl(): HTMLInputElement | null {
    return this.shadow.querySelector('input[type="checkbox"]')
  }

  get checked(): boolean {
    return this.inputEl?.checked ?? getBooleanAttr(this, 'checked')
  }

  set checked(next: boolean) {
    setBooleanAttr(this, 'checked', next)
    const input = this.inputEl
    if (input) input.checked = next
  }

  protected onAttrChange(name: string) {
    const input = this.inputEl
    if (!input) {
      this.render()
      return
    }

    if (name === 'checked') {
      input.checked = getBooleanAttr(this, 'checked')
      return
    }

    if (name === 'disabled') {
      input.disabled = getBooleanAttr(this, 'disabled')
      return
    }

    this.render()
  }

  protected template() {
    const checked = getBooleanAttr(this, 'checked')
    const disabled = getBooleanAttr(this, 'disabled')
    const name = getStringAttr(this, 'name', '')
    const value = getStringAttr(this, 'value', 'on')

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

      .wc-checkbox-wrapper {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }

      input[type='checkbox'] {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
        margin: 0;
        padding: 0;
        cursor: inherit;
      }

      .wc-checkbox-mark {
        position: absolute;
        width: 16px;
        height: 16px;
        border: 1px solid var(--wc-border);
        border-radius: 3px;
        background: var(--wc-bg);
        transition: all 0.2s ease;
        pointer-events: none;
      }

      input[type='checkbox']:checked + .wc-checkbox-mark {
        border-color: var(--wc-primary);
        background: var(--wc-primary);
      }

      .wc-checkbox-mark::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px;
        height: 6px;
        opacity: 0;
        border: solid #fff;
        border-width: 0 2px 2px 0;
        transform: translate(-50%, -50%) rotate(45deg);
        transition: opacity 0.2s ease;
      }

      input[type='checkbox']:checked + .wc-checkbox-mark::before {
        opacity: 1;
      }

      input[type='checkbox']:focus + .wc-checkbox-mark {
        box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.15);
        outline: none;
      }

      input[type='checkbox']:disabled + .wc-checkbox-mark {
        border-color: var(--wc-border);
        background: var(--wc-surface);
        cursor: not-allowed;
      }

      input[type='checkbox']:disabled:checked + .wc-checkbox-mark {
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
        <div class="wc-checkbox-wrapper">
          <input
            type="checkbox"
            ${checked ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}
            ${name ? `name="${name}"` : ''}
            value="${value}"
          />
          <div class="wc-checkbox-mark">
          </div>
        </div>
        <slot></slot>
      </label>
    `
  }

  protected afterRender() {
    const input = this.inputEl
    if (!input) return

    // Remove old listeners to prevent duplicates
    input.removeEventListener('change', this.handleChange)
    input.removeEventListener('click', this.handleClick)

    input.addEventListener('change', this.handleChange)
    input.addEventListener('click', this.handleClick)
  }

  private handleChange = () => {
    const input = this.inputEl
    if (!input) return

    // Always update checked state
    setBooleanAttr(this, 'checked', input.checked)

    this.emit('change', {
      name: getStringAttr(this, 'name', ''),
      value: getStringAttr(this, 'value', 'on'),
      checked: input.checked,
      type: 'checkbox',
    })
  }

  private handleClick = () => {
    const input = this.inputEl
    if (!input || input.disabled) return

    // Ensure checked state is reflected in attribute for consistency
    setBooleanAttr(this, 'checked', input.checked)
  }

  disconnectedCallback() {
    const input = this.inputEl
    if (input) {
      input.removeEventListener('change', this.handleChange)
      input.removeEventListener('click', this.handleClick)
    }
  }
}

customElements.define('wc-checkbox', WCCheckboxElement)
