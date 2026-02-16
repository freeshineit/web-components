import { WCBaseElement } from '@/core/base-element'
import { getStringAttr } from '@/utils/attrs'

type FormValues = Record<string, unknown>

export class WCFormElement extends WCBaseElement {
  private values: FormValues = {}

  protected template() {
    return `
      <style>
        :host {
          display: block;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
        }
      </style>
      <slot></slot>
    `
  }

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('change', this.onFieldChange as EventListener)
  }

  disconnectedCallback() {
    this.removeEventListener('change', this.onFieldChange as EventListener)
  }

  get value(): FormValues {
    return { ...this.values }
  }

  submit() {
    this.emit('submit', {
      name: getStringAttr(this, 'name', ''),
      values: { ...this.values },
    })
  }

  reset() {
    this.values = {}
    const fields = this.querySelectorAll(
      'wc-input, wc-textarea, wc-checkbox, wc-radio, wc-select, wc-switch'
    )
    fields.forEach(field => {
      if ('value' in field) {
        ;(field as any).value = ''
      }
      if ('checked' in field) {
        ;(field as any).checked = false
      }
    })
    this.emit('reset', { name: getStringAttr(this, 'name', ''), values: {} })
  }

  private onFieldChange(event: CustomEvent) {
    const detail = event.detail || {}
    const name =
      detail.name || (event.target as HTMLElement)?.getAttribute?.('name')
    if (!name) return

    if (typeof detail.checked === 'boolean') {
      this.values[name] = detail.checked
    } else {
      this.values[name] = detail.value
    }
  }
}

customElements.define('wc-form', WCFormElement)
