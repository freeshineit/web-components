import { WCBaseElement } from '@/core/base-element'
import { getBooleanAttr, getStringAttr } from '@/utils/attrs'

type SelectOption = { label: string; value: string }

function parseOptions(raw: string): SelectOption[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (typeof item === 'string') return { label: item, value: item }
        return {
          label: String(item.label ?? item.value ?? ''),
          value: String(item.value ?? item.label ?? ''),
        }
      })
    }
  } catch {
    return raw
      .split(',')
      .map(item => ({ label: item.trim(), value: item.trim() }))
  }
  return []
}

export class WCSelectElement extends WCBaseElement {
  static get observedAttributes() {
    return ['value', 'disabled', 'name', 'options']
  }

  private get selectEl(): HTMLSelectElement | null {
    return this.shadow.querySelector('select')
  }

  get value(): string {
    return this.selectEl?.value ?? getStringAttr(this, 'value', '')
  }

  set value(next: string) {
    this.setAttribute('value', next)
  }

  protected onAttrChange(
    name: string,
    _oldValue: string | null,
    newValue: string | null
  ) {
    const select = this.selectEl
    if (!select) {
      this.render()
      return
    }

    if (name === 'value' && newValue !== null) {
      if (select.value !== newValue) select.value = newValue
      return
    }

    if (name === 'disabled') {
      select.disabled = getBooleanAttr(this, 'disabled')
      return
    }

    this.render()
  }

  protected template() {
    const value = getStringAttr(this, 'value', '')
    const disabled = getBooleanAttr(this, 'disabled')
    const name = getStringAttr(this, 'name', '')
    const options = parseOptions(getStringAttr(this, 'options', ''))

    const optionHtml = options
      .map(
        option =>
          `<option value="${option.value}" ${
            option.value === value ? 'selected' : ''
          }>${option.label}</option>`
      )
      .join('')

    return `
      <style>
        :host {
          display: inline-block;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
        }
        select {
          -webkit-appearance: none; /* for Safari/Chrome (WebKit) */
          -moz-appearance: none;    /* for Firefox */
          appearance: none;
          box-sizing: border-box;
          width: 100%;
          padding: 6px 10px;
          border: 1px solid var(--wc-border);
          border-radius: var(--wc-radius);
          background: var(--wc-bg);
          color: inherit;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }

        select:focus {
          outline: none;
          border-color: var(--wc-primary);
          box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.15);
        }

        select:disabled {
          background: var(--wc-surface);
          color: var(--wc-muted);
          cursor: not-allowed;
        }
      </style>
      <select ${disabled ? 'disabled' : ''} ${name ? `name="${name}"` : ''}>
        ${optionHtml}
      </select>
    `
  }

  protected afterRender() {
    const select = this.selectEl
    if (!select) return

    select.addEventListener('change', () => {
      this.setAttribute('value', select.value)
      this.emit('change', {
        name: getStringAttr(this, 'name', ''),
        value: select.value,
        type: 'select',
      })
    })
  }
}

customElements.define('wc-select', WCSelectElement)
