exports.SidebarMenu = class SidebarMenu{

    //locator from Menu pannel
    constructor(page){
        this.page = page
        this.pimButton =  page.getByRole('link', { name: 'PIM' })
        this.dashboard =  page.getByRole('link', { name: 'Dashboard' })
    }

    /**
     * Function to navigate to PIM module
     */
    async gotoPIM(){
        await this.page.waitForLoadState('domcontentloaded')
        await this.pimButton.click()
        await this.page.waitForLoadState('domcontentloaded')

    }

    /**
     * Function to navigate to Dashboard module
     */
    async gotoDashboard(){
        await this.dashboard.click()
    }
}