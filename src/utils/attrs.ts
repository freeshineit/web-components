export function getStringAttr(
  el: HTMLElement,
  name: string,
  fallback = ''
): string {
  const value = el.getAttribute(name)
  return value === null ? fallback : value
}

export function getBooleanAttr(el: HTMLElement, name: string): boolean {
  if (!el.hasAttribute(name)) return false
  const value = el.getAttribute(name)
  return value === '' || value === name || value === 'true'
}

export function getNumberAttr(
  el: HTMLElement,
  name: string,
  fallback?: number
): number | undefined {
  const value = el.getAttribute(name)
  if (value === null || value === '') return fallback
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}

export function setBooleanAttr(el: HTMLElement, name: string, value: boolean) {
  if (value) {
    el.setAttribute(name, '')
  } else {
    el.removeAttribute(name)
  }
}
