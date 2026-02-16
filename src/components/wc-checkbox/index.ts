import { WCBaseElement } from '../../core/base-element'
import {
  getBooleanAttr,
  getStringAttr,
  setBooleanAttr,
} from '../../utils/attrs'

export class WCCheckboxElement extends WCBaseElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'name', 'value']
  }

  private get inputEl(): HTMLInputElement | null {
    return this.shadow.querySelector('input')
  }

  get checked(): boolean {
    return this.inputEl?.checked ?? getBooleanAttr(this, 'checked')
  }

  set checked(next: boolean) {
    setBooleanAttr(this, 'checked', next)
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
          gap: 6px;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
          cursor: pointer;
        }
        input {
          width: 16px;
          height: 16px;
          accent-color: var(--wc-primary);
        }
        :host([disabled]) {
          cursor: not-allowed;
          color: var(--wc-muted);
        }
      </style>
      <label>
        <input
          type="checkbox"
          ${checked ? 'checked' : ''}
          ${disabled ? 'disabled' : ''}
          ${name ? `name="${name}"` : ''}
          value="${value}"
        />
        <slot></slot>
      </label>
    `
  }

  protected afterRender() {
    const input = this.inputEl
    if (!input) return

    input.addEventListener('change', () => {
      setBooleanAttr(this, 'checked', input.checked)
      this.emit('change', {
        name: getStringAttr(this, 'name', ''),
        value: getStringAttr(this, 'value', 'on'),
        checked: input.checked,
        type: 'checkbox',
      })
    })
  }
}

customElements.define('wc-checkbox', WCCheckboxElement)
