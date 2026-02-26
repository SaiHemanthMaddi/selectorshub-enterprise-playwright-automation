export class IframePage {
    constructor(page) {
        this.page = page;
        this.url = 'https://selectorshub.com/xpath-practice-page/';
    }

    async open() {
        await this.page.goto(this.url);
    }

    getMainFrame() {
        return this.page.frameLocator('iframe');
    }

    getNestedFrame() {
        return this.page
            .frameLocator('#outerFrame')
            .frameLocator('#innerFrame');
    }
}