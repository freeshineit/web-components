;(function () {
  const body = document.body
  const byId = id => document.getElementById(id)
  const setAttr = (el, name, value) => {
    if (!el) return
    if (value === '' || value === null || value === undefined) {
      el.removeAttribute(name)
    } else {
      el.setAttribute(name, String(value))
    }
  }
  const setBoolAttr = (el, name, enabled) => {
    if (!el) return
    if (enabled) el.setAttribute(name, '')
    else el.removeAttribute(name)
  }
  const bindOutput = (el, outputEl) => {
    if (!el || !outputEl) return
    const handler = event => {
      outputEl.textContent = JSON.stringify(event.detail || {}, null, 2)
    }
    el.addEventListener('change', handler)
    el.addEventListener('input', handler)
  }

  const form = byId('demo-form')
  const formOutput = byId('form-output')
  if (form && formOutput) {
    form.addEventListener('submit', event => {
      const values = event.detail?.values || {}
      formOutput.textContent = JSON.stringify(values, null, 2)
    })
    form.addEventListener('reset', () => {
      formOutput.textContent = 'Form reset.'
    })
  }

  document.querySelectorAll('[data-theme]').forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.getAttribute('data-theme')
      body.classList.remove('wc-theme-alpha', 'wc-theme-light', 'wc-theme-dark')
      if (theme === 'light') body.classList.add('wc-theme-light')
      else if (theme === 'dark') body.classList.add('wc-theme-dark')
      else body.classList.add('wc-theme-alpha')
    })
  })

  const demoButton = byId('demo-button')
  const buttonLabel = byId('button-label')
  const buttonType = byId('button-type')
  const buttonDisabled = byId('button-disabled')
  if (demoButton) {
    buttonLabel?.addEventListener('input', () => {
      demoButton.textContent = buttonLabel.value || 'Button'
    })
    buttonType?.addEventListener('change', () => {
      setAttr(demoButton, 'type', buttonType.value)
    })
    buttonDisabled?.addEventListener('change', () => {
      setBoolAttr(demoButton, 'disabled', buttonDisabled.checked)
    })
  }

  const demoInput = byId('demo-input')
  const inputValue = byId('input-value')
  const inputPlaceholder = byId('input-placeholder')
  const inputType = byId('input-type')
  const inputMin = byId('input-min')
  const inputMax = byId('input-max')
  const inputStep = byId('input-step')
  const inputDisabled = byId('input-disabled')
  const inputReadonly = byId('input-readonly')
  bindOutput(demoInput, byId('input-output'))
  if (demoInput) {
    inputValue?.addEventListener('input', () => {
      setAttr(demoInput, 'value', inputValue.value)
    })
    inputPlaceholder?.addEventListener('input', () => {
      setAttr(demoInput, 'placeholder', inputPlaceholder.value)
    })
    inputType?.addEventListener('change', () => {
      setAttr(demoInput, 'type', inputType.value)
    })
    inputMin?.addEventListener('input', () => {
      setAttr(demoInput, 'min', inputMin.value)
    })
    inputMax?.addEventListener('input', () => {
      setAttr(demoInput, 'max', inputMax.value)
    })
    inputStep?.addEventListener('input', () => {
      setAttr(demoInput, 'step', inputStep.value)
    })
    inputDisabled?.addEventListener('change', () => {
      setBoolAttr(demoInput, 'disabled', inputDisabled.checked)
    })
    inputReadonly?.addEventListener('change', () => {
      setBoolAttr(demoInput, 'readonly', inputReadonly.checked)
    })
  }

  const demoTextarea = byId('demo-textarea')
  const textareaValue = byId('textarea-value')
  const textareaPlaceholder = byId('textarea-placeholder')
  const textareaRows = byId('textarea-rows')
  const textareaDisabled = byId('textarea-disabled')
  const textareaReadonly = byId('textarea-readonly')
  bindOutput(demoTextarea, byId('textarea-output'))
  if (demoTextarea) {
    textareaValue?.addEventListener('input', () => {
      setAttr(demoTextarea, 'value', textareaValue.value)
    })
    textareaPlaceholder?.addEventListener('input', () => {
      setAttr(demoTextarea, 'placeholder', textareaPlaceholder.value)
    })
    textareaRows?.addEventListener('input', () => {
      setAttr(demoTextarea, 'rows', textareaRows.value)
    })
    textareaDisabled?.addEventListener('change', () => {
      setBoolAttr(demoTextarea, 'disabled', textareaDisabled.checked)
    })
    textareaReadonly?.addEventListener('change', () => {
      setBoolAttr(demoTextarea, 'readonly', textareaReadonly.checked)
    })
  }

  const demoCheckbox = byId('demo-checkbox')
  const checkboxChecked = byId('checkbox-checked')
  const checkboxDisabled = byId('checkbox-disabled')
  bindOutput(demoCheckbox, byId('checkbox-output'))
  if (demoCheckbox) {
    checkboxChecked?.addEventListener('change', () => {
      setBoolAttr(demoCheckbox, 'checked', checkboxChecked.checked)
    })
    checkboxDisabled?.addEventListener('change', () => {
      setBoolAttr(demoCheckbox, 'disabled', checkboxDisabled.checked)
    })
  }

  const radioBasic = byId('demo-radio-basic')
  const radioPro = byId('demo-radio-pro')
  const radioSelected = byId('radio-selected')
  const radioDisabled = byId('radio-disabled')
  const radioOutput = byId('radio-output')
  bindOutput(radioBasic, radioOutput)
  bindOutput(radioPro, radioOutput)
  const updateRadioSelection = value => {
    setBoolAttr(radioBasic, 'checked', value === 'basic')
    setBoolAttr(radioPro, 'checked', value === 'pro')
  }
  radioSelected?.addEventListener('change', () => {
    updateRadioSelection(radioSelected.value)
  })
  radioDisabled?.addEventListener('change', () => {
    setBoolAttr(radioBasic, 'disabled', radioDisabled.checked)
    setBoolAttr(radioPro, 'disabled', radioDisabled.checked)
  })
  if (radioSelected) {
    ;[radioBasic, radioPro].forEach(radio => {
      radio?.addEventListener('change', event => {
        const value = event.detail?.value || ''
        radioSelected.value = value
      })
    })
  }

  const demoSelect = byId('demo-select')
  const selectOptions = byId('select-options')
  const selectValue = byId('select-value')
  const selectDisabled = byId('select-disabled')
  bindOutput(demoSelect, byId('select-output'))
  if (demoSelect) {
    selectOptions?.addEventListener('input', () => {
      setAttr(demoSelect, 'options', selectOptions.value)
    })
    selectValue?.addEventListener('input', () => {
      setAttr(demoSelect, 'value', selectValue.value)
    })
    selectDisabled?.addEventListener('change', () => {
      setBoolAttr(demoSelect, 'disabled', selectDisabled.checked)
    })
  }

  const demoSwitch = byId('demo-switch')
  const switchChecked = byId('switch-checked')
  const switchDisabled = byId('switch-disabled')
  bindOutput(demoSwitch, byId('switch-output'))
  if (demoSwitch) {
    switchChecked?.addEventListener('change', () => {
      setBoolAttr(demoSwitch, 'checked', switchChecked.checked)
    })
    switchDisabled?.addEventListener('change', () => {
      setBoolAttr(demoSwitch, 'disabled', switchDisabled.checked)
    })
  }

  const demoList = byId('demo-list')
  const listItems = byId('list-items')
  const listOrdered = byId('list-ordered')
  if (demoList) {
    listItems?.addEventListener('input', () => {
      setAttr(demoList, 'items', listItems.value)
    })
    listOrdered?.addEventListener('change', () => {
      setBoolAttr(demoList, 'ordered', listOrdered.checked)
    })
  }
})()
