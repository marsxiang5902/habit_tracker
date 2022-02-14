import { getEventById } from "./locateEvents"

function getMin() {
    let d = new Date()
    return d.getMinutes() + d.getHours() * 60
}
const MILLS_IN_MIN = 1000 * 60, MILLS_IN_DAY = MILLS_IN_MIN * 60 * 24
function getDay(dayStart = 0, offset = 240) {
    return (Math.floor((Date.now() - (dayStart + offset) * MILLS_IN_MIN) / MILLS_IN_DAY) + 3) % 7
}

function dayToDate(d, dayStart = 0, offset = 240) {
    let nd = new Date()
    nd.setDate((d - (dayStart + offset) * MILLS_IN_MIN) / MILLS_IN_DAY)
    return nd.getTime()
}

function dateToDay(d) {
    return Math.floor((d.getTime() * MILLS_IN_MIN) / MILLS_IN_DAY)
}


const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Firday", "Saturday"]
const months = [ "January", "February", "March", "April", "May", "June", 
           "July", "August", "September", "October", "November", "December" ];

function getPastDay(daysAgo=0){
    let d = new Date()
    d.setDate(d.getDate() - daysAgo)
    // let date = `${days[d.getDay()]} / ${months[d.getMonth()]} / ${d.getDate()} / ${d.getFullYear()}`
    let date = `${days[d.getDay()]} / ${months[d.getMonth()]} / ${d.getDate()}`
    return date
}

function sortGoals(context, goals){
    let ret = []
    let d = new Date()
    for (let id in goals){
        let goal = getEventById(context, id)
        let goalDate = new Date(goal.endDay)
        console.log(goal)
        console.log(d.getTime())
        console.log(goal.endDay)
    }
}
export { getMin, getDay, getPastDay, sortGoals, dateToDay, dayToDate, MILLS_IN_DAY }