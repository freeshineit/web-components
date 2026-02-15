import '../index'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('wc-input', () => {
  it('renders input and emits change', () => {
    const input = document.createElement('wc-input') as any
    input.setAttribute('name', 'age')
    input.setAttribute('type', 'number')
    document.body.appendChild(input)

    const nativeInput = input.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement
    nativeInput.value = '18'

    let detail: any = null
    input.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail
    })

    nativeInput.dispatchEvent(new Event('change', { bubbles: true }))

    expect(detail).toEqual({ name: 'age', value: 18, type: 'number' })
    expect(input.getAttribute('value')).toBe('18')
  })
})

describe('wc-textarea', () => {
  it('syncs value', () => {
    const textarea = document.createElement('wc-textarea') as any
    textarea.setAttribute('name', 'note')
    document.body.appendChild(textarea)

    const native = textarea.shadowRoot?.querySelector(
      'textarea'
    ) as HTMLTextAreaElement
    native.value = 'hello'

    native.dispatchEvent(new Event('change', { bubbles: true }))

    expect(textarea.getAttribute('value')).toBe('hello')
  })
})

describe('wc-checkbox', () => {
  it('toggles checked and emits change', () => {
    const checkbox = document.createElement('wc-checkbox') as any
    checkbox.setAttribute('name', 'agree')
    document.body.appendChild(checkbox)

    const native = checkbox.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement
    native.checked = true

    let detail: any = null
    checkbox.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail
    })

    native.dispatchEvent(new Event('change', { bubbles: true }))

    expect(checkbox.hasAttribute('checked')).toBe(true)
    expect(detail).toMatchObject({
      name: 'agree',
      checked: true,
      type: 'checkbox',
    })
  })
})

describe('wc-radio', () => {
  it('unchecks siblings with same name', () => {
    const a = document.createElement('wc-radio') as any
    a.setAttribute('name', 'group')
    const b = document.createElement('wc-radio') as any
    b.setAttribute('name', 'group')
    document.body.append(a, b)

    const inputA = a.shadowRoot?.querySelector('input') as HTMLInputElement
    const inputB = b.shadowRoot?.querySelector('input') as HTMLInputElement

    inputA.checked = true
    inputA.dispatchEvent(new Event('change', { bubbles: true }))

    inputB.checked = true
    inputB.dispatchEvent(new Event('change', { bubbles: true }))

    expect(a.hasAttribute('checked')).toBe(false)
    expect(b.hasAttribute('checked')).toBe(true)
  })
})

describe('wc-select', () => {
  it('renders options and emits change', () => {
    const select = document.createElement('wc-select') as any
    select.setAttribute('name', 'city')
    select.setAttribute('options', JSON.stringify(['a', 'b']))
    document.body.appendChild(select)

    const native = select.shadowRoot?.querySelector(
      'select'
    ) as HTMLSelectElement
    native.value = 'b'

    let detail: any = null
    select.addEventListener('change', (event: CustomEvent) => {
      detail = event.detail
    })

    native.dispatchEvent(new Event('change', { bubbles: true }))

    expect(select.getAttribute('value')).toBe('b')
    expect(detail).toEqual({ name: 'city', value: 'b', type: 'select' })
  })
})

describe('wc-switch', () => {
  it('toggles checked', () => {
    const sw = document.createElement('wc-switch') as any
    sw.setAttribute('name', 'enabled')
    document.body.appendChild(sw)

    const native = sw.shadowRoot?.querySelector('input') as HTMLInputElement
    native.checked = true
    native.dispatchEvent(new Event('change', { bubbles: true }))

    expect(sw.hasAttribute('checked')).toBe(true)
  })
})

describe('wc-form', () => {
  it('collects values and submits', () => {
    const form = document.createElement('wc-form') as any
    const input = document.createElement('wc-input') as any
    input.setAttribute('name', 'email')
    const button = document.createElement('wc-button') as any
    button.setAttribute('type', 'submit')
    form.append(input, button)
    document.body.appendChild(form)

    const nativeInput = input.shadowRoot?.querySelector(
      'input'
    ) as HTMLInputElement
    nativeInput.value = 'a@b.com'
    nativeInput.dispatchEvent(new Event('change', { bubbles: true }))

    let submitted: any = null
    form.addEventListener('submit', (event: CustomEvent) => {
      submitted = event.detail
    })

    const nativeButton = button.shadowRoot?.querySelector(
      'button'
    ) as HTMLButtonElement
    nativeButton.click()

    expect(submitted.values).toEqual({ email: 'a@b.com' })
  })
})

describe('wc-list', () => {
  it('renders items attribute', () => {
    const list = document.createElement('wc-list') as any
    list.setAttribute('items', JSON.stringify(['one', 'two']))
    document.body.appendChild(list)

    const items = list.shadowRoot?.querySelectorAll('li')
    expect(items?.length).toBe(2)
  })
})
