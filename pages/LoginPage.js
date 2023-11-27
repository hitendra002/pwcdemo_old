exports.LoginPage = class LoginPage {

    //locators from Login webpage
    constructor(page) {
        this.page = page
        this.userNameField =  page.locator('[name="username"]')
        this.passwordField = page.locator('[name="password"]')
        this.loginButton = page.locator('[type="submit"]')
    }

    /**
     * Function used to Login into OrangeHRM
     * @param {string} username Username
     * @param {string} password Password
     */
    async userLogin(username, password){
        await this.page.goto("https://opensource-demo.orangehrmlive.com/index.php")
        await this.page.reload()
        await this.userNameField.fill(username)
        await this.passwordField.fill(password)
        await this.loginButton.click()
        await this.page.waitForLoadState('networkidle') //sometimes observe 503 Error on web page
    }
}