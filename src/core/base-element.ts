export abstract class WCBaseElement extends HTMLElement {
  protected shadow: ShadowRoot;
  private hasRendered = false;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null) {
    if (oldValue === newValue) return;
    this.onAttrChange(name, oldValue, newValue);
  }

  protected onAttrChange(_name: string, _oldValue: string | null, _newValue: string | null) {
    this.render();
  }

  protected render() {
    const html = this.template();
    if (!this.hasRendered || this.shadow.innerHTML !== html) {
      this.shadow.innerHTML = html;
      this.hasRendered = true;
      this.afterRender();
    }
  }

  protected abstract template(): string;

  protected afterRender() {}

  protected emit<T>(name: string, detail: T) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    );
  }
}
