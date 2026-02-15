import { WCBaseElement } from '../core/base-element'
import { getBooleanAttr, getNumberAttr, getStringAttr } from '../utils/attrs'

export class WCTextareaElement extends WCBaseElement {
  static get observedAttributes() {
    return ['value', 'placeholder', 'disabled', 'name', 'readonly', 'rows']
  }

  private get textareaEl(): HTMLTextAreaElement | null {
    return this.shadow.querySelector('textarea')
  }

  get value(): string {
    return this.textareaEl?.value ?? getStringAttr(this, 'value', '')
  }

  set value(next: string) {
    this.setAttribute('value', next)
  }

  protected onAttrChange(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    const textarea = this.textareaEl
    if (!textarea) {
      this.render()
      return
    }

    if (name === 'value' && newValue !== null) {
      if (textarea.value !== newValue) textarea.value = newValue
      return
    }

    if (name === 'disabled') {
      textarea.disabled = getBooleanAttr(this, 'disabled')
      return
    }

    if (name === 'placeholder') {
      textarea.placeholder = getStringAttr(this, 'placeholder', '')
      return
    }

    this.render()
  }

  protected template() {
    const value = getStringAttr(this, 'value', '')
    const placeholder = getStringAttr(this, 'placeholder', '')
    const disabled = getBooleanAttr(this, 'disabled')
    const readonly = getBooleanAttr(this, 'readonly')
    const name = getStringAttr(this, 'name', '')
    const rows = getNumberAttr(this, 'rows', 3)

    return `
      <style>
        :host {
          display: inline-block;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
        }
        .textarea {
          box-sizing: border-box;
          width: 100%;
          padding: 6px 10px;
          border: 1px solid var(--wc-border);
          border-radius: var(--wc-radius);
          background: var(--wc-bg);
          color: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          resize: vertical;
        }
        .textarea:focus {
          outline: none;
          border-color: var(--wc-primary);
          box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
        }
        .textarea:disabled {
          background: var(--wc-surface);
          color: var(--wc-muted);
          cursor: not-allowed;
        }
      </style>
      <textarea
        class="textarea"
        rows="${rows}"
        placeholder="${placeholder}"
        ${disabled ? 'disabled' : ''}
        ${readonly ? 'readonly' : ''}
        ${name ? `name="${name}"` : ''}
      >${value}</textarea>
    `
  }

  protected afterRender() {
    const textarea = this.textareaEl
    if (!textarea) return

    textarea.addEventListener('input', () => {
      this.emit('input', {
        name: getStringAttr(this, 'name', ''),
        value: textarea.value,
        type: 'textarea',
      })
    })

    textarea.addEventListener('change', () => {
      this.setAttribute('value', textarea.value)
      this.emit('change', {
        name: getStringAttr(this, 'name', ''),
        value: textarea.value,
        type: 'textarea',
      })
    })
  }
}

customElements.define('wc-textarea', WCTextareaElement)
