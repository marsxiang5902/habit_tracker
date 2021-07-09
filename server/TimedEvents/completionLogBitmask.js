const MILLS_IN_DAY = 1000 * 60 * 60 * 24, MOD = 4294967296
function getDay() {
    return Date().now() / MILLS_IN_DAY
}
class completionLogBitmask {
    constructor(date, bit) {
        // date - days since 1970
        this.date = getDay(date)
        this.bit = bit
    }
    realignDate() {
        let realDate = getdDay()
        let dateDiff = realDate - this.date
        this.date = realDate
        this.bit <<= dateDiff
        this.bit %= MOD
    }
}
module.exports = {
    getDay: getDay,
    completionLogBitmask: completionLogBitmask
}