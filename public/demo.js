;(function () {
  const form = document.getElementById('demo-form')
  const output = document.getElementById('form-output')
  const body = document.body

  if (form && output) {
    form.addEventListener('submit', event => {
      const values = event.detail?.values || {}
      output.textContent = JSON.stringify(values, null, 2)
    })

    form.addEventListener('reset', () => {
      output.textContent = 'Form reset.'
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
})()
