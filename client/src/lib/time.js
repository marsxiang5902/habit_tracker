function getMin() {
    let d = new Date()
    return d.getMinutes() + d.getHours() * 60
}
const MILLS_IN_MIN = 1000 * 60, MILLS_IN_DAY = MILLS_IN_MIN * 60 * 24
function getDay(dayStart = 0, offset = 240) {
    return (Math.floor((Date.now() - (dayStart + offset) * MILLS_IN_MIN) / MILLS_IN_DAY) + 3) % 7
}
function date2Day(d, dayStart = 0, offset = 240) {
    return Math.floor((d.getTime() - (dayStart + offset) * MILLS_IN_MIN) / MILLS_IN_DAY)
}
function day2Date(d, dayStart = 0, offset = 240) {
    return new Date(d * MILLS_IN_DAY + (dayStart + offset) * MILLS_IN_MIN + (new Date()).getTimezoneOffset() * MILLS_IN_MIN)
}

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"]
const months = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

function getPastDay(daysAgo = 0) {
    let d = new Date()
    d.setDate(d.getDate() - daysAgo)
    // let date = `${days[d.getDay()]} / ${months[d.getMonth()]} / ${d.getDate()} / ${d.getFullYear()}`
    let date = `${days[d.getDay()]} / ${months[d.getMonth()]} / ${d.getDate()}`
    return date
}
export { getMin, getDay, getPastDay }