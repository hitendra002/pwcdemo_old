import { test, expect } from "@playwright/test";
import { LoginPage } from '../pages/LoginPage';
import { PimPage } from '../pages/PimPage';
import { SidebarMenu } from "../pages/SideBarMenu";
const employeeData = require("../test-data/emplyoeeData.json")
const Util = require("../utils/util")

test.describe("Orange HRM test", async () => {
    test.beforeEach(async ({}) => {
    })

    test.afterEach(async ({ page }) => {
        await page.close()
    })

    test("Add Emplyoee and Verify personal details", async ({ page }) => {
        const loginPage = new LoginPage(page)
        const pim = new PimPage(page)
        const menu = new SidebarMenu(page)

        //Login to HRM as Admin
        await loginPage.userLogin("Admin", "admin123")

        //Add Employee details
        const emp = {
            "firstname": "John",
            "middlename": "wick",
            "lastname": "Smith",
            "id": Util.getEmpID()
        }
        await menu.gotoPIM()
        await pim.gotoAddEmplyoeeTab()
        console.log("empid", emp.id)

        await pim.addEmployee(emp.firstname, emp.lastname, emp.middlename, emp.id)

        const personalDetails = { "nationality": "Swedish", "maritalStatus": "Single", "birthDate": "1992-01-01", "gender": "Male", "bloodType": "B+" }
        await pim.updatePersonalDetails(personalDetails)

        const contactDetails = { "street1": "Almbyplan 123", "street2": "Orebro", "city":"Orebro", "state": "Orebro", "postalCode": "70217", "country": "Sweden", "mobile": "078000000"}
        await pim.updateContactDetails(contactDetails)

        //Search for Emplyoee
        await menu.gotoPIM()
        await pim.gotoEmplyoeeListTab()
        await pim.searchEmplyoeeWithId(emp.id)

        //Assert: verify emplyoee personal details
        await pim.verifyEmplyoeeId(emp.id)
        await pim.verifyEmplyoeeFirstMiddleName(emp.firstname, emp.middlename)
        await pim.verifyEmplyoeeLastName(emp.lastname)

        await pim.viewEmployeeDetails(emp.id)
        await pim.verifyPersonalDetails(personalDetails)
        await pim.verifyContactDetails(contactDetails)
    })

    employeeData.forEach((employee, index) => {
        test(`Data-Driven: Add multiple emplyoee from test data file:${index + 1}`, async ({ page }) => {
            const loginPage = new LoginPage(page)
            const pim = new PimPage(page)
            const menu = new SidebarMenu(page)

            //Login to HRM as Admin
            await loginPage.userLogin("Admin", "admin123")

            //Add Employee from test data file
            await menu.gotoPIM()
            await pim.gotoAddEmplyoeeTab()
            await pim.addEmployee(employee.firstname, employee.lastname, undefined, Util.getEmpID())
         })
    })

})