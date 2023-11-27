exports.SidebarMenu = class SidebarMenu{

    constructor(page){
        this.page = page
        this.pimButton =  page.getByRole('link', { name: 'PIM' })
        this.dashboard =  page.getByRole('link', { name: 'Dashboard' })
    }

    async gotoPIM(){
        await this.page.waitForLoadState('domcontentloaded')
        await this.pimButton.click()
        await this.page.waitForLoadState('domcontentloaded')

    }

    async gotoDashboard(){
        await this.dashboard.click()
    }
}