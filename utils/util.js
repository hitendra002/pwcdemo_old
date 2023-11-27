
const Utils = {
    /**
     * To generate unique EmpID
     * @returns {string} Empyoee Id
     */
    getEmpID(){
        const date = new Date()
        return `${date.getHours()}${date.getMinutes()}${date.getSeconds()}${date.getMilliseconds()}`
    }
}

module.exports = Utils