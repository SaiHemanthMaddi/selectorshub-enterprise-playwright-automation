export class ShadowPage {
  constructor(page) {
    this.page = page;

    this.url = 'https://selectorshub.com/xpath-practice-page/';
    this.iframeInsideShadowUrl = 'https://selectorshub.com/iframe-in-shadow-dom/';
    this.shadowInsideIframeUrl = 'https://selectorshub.com/shadow-dom-in-iframe/';

    // Open shadow root on practice page
    this.openShadowInput = '#userName >> #kils';
    this.nestedShadowInput = '#userName >> #app2 >> #pizza';
    this.svgInsideShadow = '#userName >> svg';

    // iframe hosted inside shadow root
    this.iframeInsideShadow = '#userName >> iframe#pact1';
  }

  async open() {
    await this.page.goto(this.url);
  }

  async openIframeInsideShadowPage() {
    await this.page.goto(this.iframeInsideShadowUrl);
  }

  async openShadowInsideIframePage() {
    await this.page.goto(this.shadowInsideIframeUrl);
  }

  async fillOpenShadowInput(text) {
    await this.page.locator(this.openShadowInput).fill(text);
  }

  async fillNestedShadowInput(text) {
    await this.page.locator(this.nestedShadowInput).fill(text);
  }
}
