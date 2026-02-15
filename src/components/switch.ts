import { WCBaseElement } from '../core/base-element'
import { getBooleanAttr, getStringAttr, setBooleanAttr } from '../utils/attrs'

export class WCSwitchElement extends WCBaseElement {
  static get observedAttributes() {
    return ['checked', 'disabled', 'name']
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

    return `
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
        }
        .switch {
          position: relative;
          width: 36px;
          height: 20px;
          border-radius: 12px;
          background: var(--wc-border);
          transition: background 0.2s ease;
          cursor: pointer;
        }
        .knob {
          position: absolute;
          top: 2px;
          left: 2px;
          width: 16px;
          height: 16px;
          background: #fff;
          border-radius: 50%;
          transition: left 0.2s ease;
          box-shadow: var(--wc-shadow);
        }
        :host([checked]) .switch {
          background: var(--wc-primary);
        }
        :host([checked]) .knob {
          left: 18px;
        }
        input {
          position: absolute;
          opacity: 0;
          width: 0;
          height: 0;
        }
        :host([disabled]) .switch {
          cursor: not-allowed;
          background: var(--wc-surface);
        }
      </style>
      <label class="switch">
        <input type="checkbox" ${checked ? 'checked' : ''} ${
          disabled ? 'disabled' : ''
        } ${name ? `name="${name}"` : ''} />
        <span class="knob"></span>
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
        checked: input.checked,
        type: 'switch',
      })
    })
  }
}

customElements.define('wc-switch', WCSwitchElement)
