import { WCBaseElement } from '@/core/base-element'
import { getBooleanAttr, getStringAttr } from '@/utils/attrs'

export class WCButtonElement extends WCBaseElement {
  static get observedAttributes() {
    return ['type', 'disabled']
  }

  protected template() {
    const type = getStringAttr(this, 'type', 'button')
    const disabled = getBooleanAttr(this, 'disabled')

    return `
      <style>
        :host {
          display: inline-block;
          font-family: var(--wc-font-family);
        }
        button {
          padding: 6px 14px;
          border-radius: var(--wc-radius);
          border: 1px solid var(--wc-primary);
          background: var(--wc-primary);
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease, border-color 0.2s ease;
          box-shadow: var(--wc-shadow);
        }
        button:hover {
          background: var(--wc-primary-hover);
          border-color: var(--wc-primary-hover);
        }
        button:disabled {
          background: var(--wc-surface);
          border-color: var(--wc-border);
          color: var(--wc-muted);
          cursor: not-allowed;
          box-shadow: none;
        }
      </style>
      <button type="${type}" ${disabled ? 'disabled' : ''}>
        <slot></slot>
      </button>
    `
  }

  protected afterRender() {
    const button = this.shadow.querySelector('button')
    if (!button) return

    button.addEventListener('click', event => {
      const type = getStringAttr(this, 'type', 'button')
      if (type === 'submit') {
        const form = this.closest('wc-form') as HTMLElement | null
        if (form && 'submit' in form) {
          ;(form as any).submit()
          event.preventDefault()
        }
      }
      if (type === 'reset') {
        const form = this.closest('wc-form') as HTMLElement | null
        if (form && 'reset' in form) {
          ;(form as any).reset()
          event.preventDefault()
        }
      }
    })
  }
}

customElements.define('wc-button', WCButtonElement)
