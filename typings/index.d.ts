declare module '*.scss' {
  const content: string
  export default content
}

export interface WCInputElement extends HTMLElement {
  value: string
}

export interface WCTextareaElement extends HTMLElement {
  value: string
}

export interface WCButtonElement extends HTMLElement {}

export interface WCCheckboxElement extends HTMLElement {
  checked: boolean
}

export interface WCRadioElement extends HTMLElement {
  checked: boolean
}

export interface WCSelectElement extends HTMLElement {
  value: string
}

export interface WCSwitchElement extends HTMLElement {
  checked: boolean
}

export interface WCFormElement extends HTMLElement {
  value: Record<string, unknown>
  submit: () => void
  reset: () => void
}

export interface WCListElement extends HTMLElement {}

declare global {
  interface HTMLElementTagNameMap {
    'wc-input': WCInputElement
    'wc-textarea': WCTextareaElement
    'wc-button': WCButtonElement
    'wc-checkbox': WCCheckboxElement
    'wc-radio': WCRadioElement
    'wc-select': WCSelectElement
    'wc-switch': WCSwitchElement
    'wc-form': WCFormElement
    'wc-list': WCListElement
  }

  namespace JSX {
    interface IntrinsicElements {
      'wc-input': WCInputElement
      'wc-textarea': WCTextareaElement
      'wc-button': WCButtonElement
      'wc-checkbox': WCCheckboxElement
      'wc-radio': WCRadioElement
      'wc-select': WCSelectElement
      'wc-switch': WCSwitchElement
      'wc-form': WCFormElement
      'wc-list': WCListElement
    }
  }
}

export {}
