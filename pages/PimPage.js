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
     * 
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

    async searchEmplyoeeWithId(empID){
       await this.emplyoeeIdTextArea.fill(empID)
       await this.searchButton.click()
    }

    async verifyEmplyoeeId(empID){
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[2]')).toHaveText(empID)
    }

    async verifyEmplyoeeFirstMiddleName(firstname, middlename=''){
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[3]')).toHaveText(firstname+' '+middlename)
    }

    async verifyEmplyoeeLastName(lastname){
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[4]')).toHaveText(lastname)
    }
}


