import { safeClick, safeType } from '../utils/waits.utils.js';

export class ComplexPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://selectorshub.com/xpath-practice-page/';
    }

    // Use getters to create fresh locators
    get enableButton() {
        return this.page.locator('//button[normalize-space()="Checkout here"]');
    }

    get firstNameInput() {
        return this.page.locator('//input[@placeholder="First Enter name"]');
    }

    get svgElement() {
        return this.page.locator('svg:visible');
    }

    get unicodeText() {
        this.unicodeText = page.locator('#unicode-output');
    }

    get multilingualText() {
        return this.page.locator('//p[contains(text(),"也支持中文")]');
    }

    get hiddenTextbox() {
        return this.page.locator('//input[@placeholder="First Crush"]');
    }

    get trickyButton() {
        return this.page.locator('//button[normalize-space()="Checkout here"]');
    }

    async open() {
        await this.page.goto(this.url);
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
    }

    async enableAndTypeName(name) {
        const hoverIcon = this.page.locator('img').first();
        await hoverIcon.hover();

        await this.page.waitForFunction(el => !el.disabled, this.firstNameInput);
        await this.firstNameInput.fill(name);
    }
}