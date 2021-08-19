function getMin() {
    let d = new Date()
    return d.getMinutes() + d.getHours() * 60
}
const MILLS_IN_MIN = 1000 * 60, MILLS_IN_DAY = MILLS_IN_MIN * 60 * 24
function getDay(dayStart = Date.now(), offset = 240) {
    return (Math.floor((dayStart - offset * MILLS_IN_MIN) / MILLS_IN_DAY) + 3) % 7
}
export { getMin, getDay }