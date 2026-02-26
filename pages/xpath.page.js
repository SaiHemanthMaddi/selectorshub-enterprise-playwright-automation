class XPathPage {
    constructor(page) {
        this.page = page;
        this.url = 'https://selectorshub.com/xpath-practice-page/';

        // Form fields
        this.emailInput = '//input[@placeholder="Enter email"]';
        this.passwordInput = '//input[@placeholder="Enter Password"]';

        // Links
        this.youtubeLink = '//a[normalize-space()="SelectorsHub Youtube Channel"]';
        this.partialLink = '//a[contains(text(),"SelectorsHub")]';

        // Table
        this.johnSmith = '//td[text()="John.Smith"]';
        this.joeRootRow = '//td[text()="Joe.Root"]/parent::tr';

        // Generic
        this.firstTableRow = '(//table//tr)[2]';
    }

    async open() {
        await this.page.goto(this.url);
    }
}

module.exports = { XPathPage };