import { WCBaseElement } from '../../core/base-element'
import { getBooleanAttr, getStringAttr } from '../../utils/attrs'

type ListItem = { label: string; value?: string }

function parseItems(raw: string): ListItem[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map(item => {
        if (typeof item === 'string') return { label: item }
        return {
          label: String(item.label ?? item.value ?? ''),
          value: item.value,
        }
      })
    }
  } catch {
    return raw.split(',').map(item => ({ label: item.trim() }))
  }
  return []
}

export class WCListElement extends WCBaseElement {
  static get observedAttributes() {
    return ['items', 'ordered']
  }

  protected template() {
    const items = parseItems(getStringAttr(this, 'items', ''))
    const ordered = getBooleanAttr(this, 'ordered')
    const tag = ordered ? 'ol' : 'ul'

    if (items.length === 0) {
      return `
        <style>
          :host {
            display: block;
            font-family: var(--wc-font-family);
            color: var(--wc-text);
          }
          ul,
          ol {
            margin: 0;
            list-style: none;
            padding: 0;
          }
        </style>
        <${tag}><slot></slot></${tag}>
      `
    }

    const content = items.map(item => `<li>${item.label}</li>`).join('')
    return `
      <style>
        :host {
          display: block;
          font-family: var(--wc-font-family);
          color: var(--wc-text);
        }
        ul,
        ol {
          margin: 0;
          padding: 0;
          list-style: none;
        }
        li {
          padding: 4px 0;
        }
      </style>
      <${tag}>${content}</${tag}>
    `
  }
}

customElements.define('wc-list', WCListElement)
