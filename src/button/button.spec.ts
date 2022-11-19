//button.spec.ts
import { LitElement } from 'lit'
import './index'
describe('wc-button', () => {
  const AWESOME_BUTTON_TAG = 'wc-button'

  it('displays button text', async () => {
    const dummyText = 'Web components & JSDOM'
    const buttonElement = window.document.createElement(
      AWESOME_BUTTON_TAG
    ) as LitElement

    buttonElement.innerHTML = dummyText
    window.document.body.appendChild(buttonElement)
    await buttonElement.updateComplete

    const renderedText =
      window.document.body.getElementsByTagName(AWESOME_BUTTON_TAG)[0]
        .textContent

    console.log('renderedText', typeof renderedText, renderedText)

    expect(renderedText?.indexOf(dummyText)).not.toBe(-1)
  })
})
