const { expect } = require("@playwright/test")

exports.PimPage = class PimPage {

    constructor(page) {
        //locators from PIM webpage
        this.page = page
        this.firstName = page.getByPlaceholder('First Name')
        this.middleName = page.getByPlaceholder('Middle Name')
        this.lastName = page.getByPlaceholder('Last Name')
        this.saveButton = page.getByRole('button', { name: 'Save' })
        this.searchButton = page.getByRole('button', { name: 'Search' })
        this.addEmplyoeeTab = page.getByRole('link', { name: 'Add Employee' })
        this.emplyoeeListTab = page.getByRole('link', { name: 'Employee List' })
        this.emplyoeeIdTextArea = page.locator('(//input[@class="oxd-input oxd-input--active"])[2]')
    }
    /**
     * To navigate Add Emplyoee Tab
     */
    async gotoAddEmplyoeeTab() {
        await this.addEmplyoeeTab.click()
    }

    /**
     * To navigate Emplyoee List Tab
     */
    async gotoEmplyoeeListTab() {
        await this.emplyoeeListTab.click()
    }

    /**
     * Function to Add emplyoee with personal details
     * @param {string} firstname Employee's First name
     * @param {string} middlename Employee's Middle name
     * @param {string} lastname Employee's Last name
     * @param {string} empID Employee ID
     */
    async addEmployee(firstname, lastname, middlename = '', empID = '') {
        await this.firstName.fill(firstname)
        await this.lastName.fill(lastname)
        if (middlename) {
            await this.middleName.fill(middlename)
        }
        if (empID) {
            await this.emplyoeeIdTextArea.fill(empID)
        }
        await this.page.locator('input[type="file"]').setInputFiles('profile.png');
        await this.saveButton.click()
        await this.page.waitForSelector('[class="orangehrm-edit-employee-image"]')
    }

    /**
     * Function to Search emplyoee usig ID
     * @param {string} empID 
     */
    async searchEmplyoeeWithId(empID){
       await this.emplyoeeIdTextArea.fill(empID)
       await this.searchButton.click()
    }

    /**
     * Function to verify emplyoee id
     * @param {string} empID 
     */
    async verifyEmplyoeeId(empID){
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[2]')).toHaveText(empID)
    }

    /**
     * Function to verify emplyoee firstname and Middle name
     * @param {string} firstname 
     * @param {string} middlename 
     */
    async verifyEmplyoeeFirstMiddleName(firstname, middlename=''){
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[3]')).toHaveText(firstname+' '+middlename)
    }

    /**
     * Function to verify emplyoee lastname
     * @param {string} lastname 
     */
    async verifyEmplyoeeLastName(lastname){
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[4]')).toHaveText(lastname)
    }
}


