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
        this.inputTextForLable = (lableName) => page.locator(`//label[normalize-space()='${lableName}']/parent::div/following-sibling::div/input`)
        this.selectTextForLable = (lableName) => page.locator(`//label[text()='${lableName}']/parent::div/following-sibling::div//div[@class='oxd-select-text-input']`)
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
        await this.page.waitForSelector('[class="oxd-toast-content oxd-toast-content--success"]')
        await this.page.waitForSelector('[class="orangehrm-edit-employee-image"]')
    }

    async gotoPersonalDetails() {
        await this.page.getByRole('link', { name: 'Personal Details' }).click();
        await this.page.waitForLoadState('networkidle')
        await this.page.waitForSelector('h6:visible:has-text("Personal Details")');
    }

    /**
     * Function to add Personal details of employee - Add configuration as describe
     * dataObject = {"birthDate": "1992-01-01", "gender": "Male", "bloodType": "B+"}
     * @param {object} dataObject Contains Personal details of employee
     * @param {string} nationality Nationality
     * @param {string} maritalStatus Marital Status
     * @param {string} birthDate Birthdate
     * @param {string} gender Gender Male/Female
     * @param {string} bloodType Blood Group (A,B,O,...)
     */
    async updatePersonalDetails(dataObject) {
        this.gotoPersonalDetails()
        // Select Nationality
        if (dataObject.nationality) {
            await this.selectTextForLable('Nationality').click()
            await this.page.getByRole('option', { name: dataObject.nationality, exact: true }).click();
        }
        // Select Marital Status
        if (dataObject.maritalStatus) {
            await this.selectTextForLable('Marital Status').click()
            await this.page.getByRole('option', { name: dataObject.maritalStatus, exact: true }).click();
        }
        // update birthdate
        await this.page.locator("(//input[@placeholder='yyyy-mm-dd'])[2]").fill(dataObject.birthDate)
        // select gender
        await this.page.locator(`//label[text()="${dataObject.gender}"]/span[contains(@class,"oxd-radio-input")]`).check()
        await this.saveButton.first().click()
        await this.page.waitForSelector('[class="oxd-toast-content oxd-toast-content--success"]')
        await this.page.waitForLoadState('networkidle')
        // select blood group
        if (dataObject.bloodType) {
            await this.selectTextForLable('Blood Type').click()
            await this.page.getByRole('option', { name: dataObject.bloodType, exact: true }).click();
            await this.saveButton.last().click()
            await this.page.waitForSelector('[class="oxd-toast-content oxd-toast-content--success"]')
            await this.page.waitForLoadState('networkidle')
        }
    }

    /**
     * Function to add Contact details of employee - Add configuration as describe
     * dataObject = {"street1": "Street address 1", "street2": "Street address 2", "country": "Sweden"}
     * @param {object} dataObject Contains Contact details of employee
     * @param {string} street1 Address line 1
     * @param {string} street2 Address line 2
     * @param {string} city City
     * @param {string} state State/Province
     * @param {string} postalCode Postal Code
     * @param {string} country Country
     * @param {string} mobile Mobile number
     */

    async gotoContactDetails() {
        await this.page.getByRole('link', { name: 'Contact Details' }).click();
        await this.page.waitForLoadState('networkidle')
        await this.page.waitForSelector('h6:visible:has-text("Contact Details")');
    }
    async updateContactDetails(dataObject) {
        await this.gotoContactDetails()
        // Update address line 1
        if (dataObject.street1) {
            await this.inputTextForLable("Street 1").fill(dataObject.street1)
        }
        // Update address line 2
        if (dataObject.street2) {
            await this.inputTextForLable("Street 2").fill(dataObject.street2)
        }
        // Update City
        if (dataObject.city) {
            await this.inputTextForLable("City").fill(dataObject.city)
        }
        // Update state/Province
        if (dataObject.state) {
            await this.inputTextForLable("State/Province").fill(dataObject.state)
        }
        // Update Zip/Postal code
        if (dataObject.postalCode) {
            await this.inputTextForLable("Zip/Postal Code").fill(dataObject.postalCode)
        }
        // Select country
        if (dataObject.country) {
            await this.selectTextForLable("Country").click()
            await this.page.getByRole('option', { name: dataObject.country }).click();
        }
        // Update Mobile number
        if (dataObject.mobile) {
            await this.inputTextForLable("Mobile").fill(dataObject.mobile)
        }
        await this.saveButton.click()
        await this.page.waitForSelector('[class="oxd-toast-content oxd-toast-content--success"]')
        await this.page.waitForLoadState('networkidle')
    }

    /**
     * Function to Search emplyoee usig ID
     * @param {string} empID 
     */
    async searchEmplyoeeWithId(empID) {
        await this.page.waitForLoadState('networkidle')
        await this.emplyoeeIdTextArea.fill(empID)
        await this.searchButton.click()
        await this.page.waitForLoadState('networkidle')
    }

    async viewEmployeeDetails(empID) {
        await this.searchEmplyoeeWithId(empID)
        await this.page.locator(`//div[@class='oxd-table-cell oxd-padding-cell' and div[text()='${empID}']]`).click()
        await this.page.waitForSelector('[class="orangehrm-edit-employee-image"]')
        await this.page.waitForLoadState('networkidle')
    }

    /**
     * Function to verify emplyoee id
     * @param {string} empID 
     */
    async verifyEmplyoeeId(empID) {
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[2]')).toHaveText(empID)
    }

    /**
     * Function to verify emplyoee firstname and Middle name
     * @param {string} firstname 
     * @param {string} middlename 
     */
    async verifyEmplyoeeFirstMiddleName(firstname, middlename = '') {
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[3]')).toHaveText(firstname + ' ' + middlename)
    }

    /**
     * Function to verify emplyoee lastname
     * @param {string} lastname 
     */
    async verifyEmplyoeeLastName(lastname) {
        await expect(this.page.locator('(//div[@class="oxd-table-cell oxd-padding-cell"])[4]')).toHaveText(lastname)
    }

    async verifyPersonalDetails(dataObject) {
        await this.gotoPersonalDetails()
        await expect(this.selectTextForLable("Nationality")).toHaveText(dataObject.nationality)
        await expect(this.selectTextForLable("Marital Status")).toHaveText(dataObject.maritalStatus)
        await expect(this.selectTextForLable("Blood Type")).toHaveText(dataObject.bloodType)
        expect(await this.page.locator("(//input[@placeholder='yyyy-mm-dd'])[2]").inputValue()).toBe(dataObject.birthDate)
        await expect(this.page.locator(`//label[text()="${dataObject.gender}"]/span[contains(@class,"oxd-radio-input")]`)).toBeChecked()
    }

    async verifyContactDetails(dataObject) {
        await this.gotoContactDetails()
        expect(await this.inputTextForLable("Street 1").inputValue()).toBe(dataObject.street1)
        expect(await this.inputTextForLable("Street 2").inputValue()).toBe(dataObject.street2)
        expect(await this.inputTextForLable("City").inputValue()).toBe(dataObject.city)
        expect(await this.inputTextForLable("State/Province").inputValue()).toBe(dataObject.state)
        expect(await this.inputTextForLable("Zip/Postal Code").inputValue()).toBe(dataObject.postalCode)
        await expect(this.selectTextForLable("Country")).toHaveText(dataObject.country)
        expect(await this.inputTextForLable("Mobile").inputValue()).toBe(dataObject.mobile)
    }
}


