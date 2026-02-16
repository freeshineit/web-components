import { WCBaseElement } from '../../core/base-element'
import { getBooleanAttr, getNumberAttr, getStringAttr } from '../../utils/attrs'

export class WCInputElement extends WCBaseElement {
  static get observedAttributes() {
    return [
      'type',
      'value',
      'placeholder',
      'disabled',
      'name',
      'readonly',
      'min',
      'max',
      'step',
    ]
  }

  private get inputEl(): HTMLInputElement | null {
    return this.shadow.querySelector('input')
  }

  get value(): string {
    return this.inputEl?.value ?? getStringAttr(this, 'value', '')
  }

  set value(next: string) {
    this.setAttribute('value', next)
  }

  protected onAttrChange(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    const input = this.inputEl
    if (!input) {
      this.render()
      return
    }

    if (name === 'value' && newValue !== null) {
      if (input.value !== newValue) input.value = newValue
      return
    }

    if (name === 'disabled') {
      input.disabled = getBooleanAttr(this, 'disabled')
      return
    }

    if (name === 'placeholder') {
      input.placeholder = getStringAttr(this, 'placeholder', '')
      return
    }

    this.render()
  }

  protected template() {
    const typeAttr = getStringAttr(this, 'type', 'text')
    const type = typeAttr === 'number' ? 'number' : 'text'
    const value = getStringAttr(this, 'value', '')
    const placeholder = getStringAttr(this, 'placeholder', '')
    const disabled = getBooleanAttr(this, 'disabled')
    const readonly = getBooleanAttr(this, 'readonly')
    const name = getStringAttr(this, 'name', '')
    const min = getNumberAttr(this, 'min')
    const max = getNumberAttr(this, 'max')
    const step = getNumberAttr(this, 'step')

    const minAttr = min !== undefined ? ` min="${min}"` : ''
    const maxAttr = max !== undefined ? ` max="${max}"` : ''
    const stepAttr = step !== undefined ? ` step="${step}"` : ''

    return `
      <style>
        :host {
          display: inline-block;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
        }
        .wc-input {
          box-sizing: border-box;
          width: 100%;
          padding: 6px 10px;
          border: 1px solid var(--wc-border);
          border-radius: var(--wc-radius);
          background: var(--wc-bg);
          color: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .wc-input:focus {
          outline: none;
          border-color: var(--wc-primary);
          box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
        }
        .wc-input:disabled {
          background: var(--wc-surface);
          color: var(--wc-muted);
          cursor: not-allowed;
        }
      </style>
      <input
        class="wc-input"
        type="${type}"
        value="${value}"
        placeholder="${placeholder}"
        ${disabled ? 'disabled' : ''}
        ${readonly ? 'readonly' : ''}
        ${name ? `name="${name}"` : ''}
        ${minAttr}${maxAttr}${stepAttr}
      />
    `
  }

  protected afterRender() {
    const input = this.inputEl
    if (!input) return

    input.addEventListener('input', () => {
      const detail = this.getEmitDetail(input.value)
      this.emit('input', detail)
    })

    input.addEventListener('change', () => {
      this.setAttribute('value', input.value)
      const detail = this.getEmitDetail(input.value)
      this.emit('change', detail)
    })
  }

  private getEmitDetail(value: string) {
    const type = getStringAttr(this, 'type', 'text')
    const name = getStringAttr(this, 'name', '')
    if (type === 'number') {
      const num = Number(value)
      return { name, value: Number.isNaN(num) ? null : num, type }
    }
    return { name, value, type }
  }
}

customElements.define('wc-input', WCInputElement)
