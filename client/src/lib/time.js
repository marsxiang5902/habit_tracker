import { getEventById } from "./locateEvents"

function getMin() {
    let d = new Date()
    return d.getMinutes() + d.getHours() * 60
}
const MILLS_IN_MIN = 1000 * 60, MILLS_IN_DAY = MILLS_IN_MIN * 60 * 24
function getDay(dayStart = 0, offset = 240) {
    return (Math.floor((Date.now() - (dayStart + offset) * MILLS_IN_MIN) / MILLS_IN_DAY) + 3) % 7
}
function getFutureDate(daysInFuture){
    return new Date(Date.now() + (daysInFuture * MILLS_IN_DAY));
}
function getDaysToFuture(date){
    return date2Day(date) - date2Day(new Date());
}
//curr_day + (end_day * mills_in_day)
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

function convertMeridianToArmy(am, hour){
    if(am){
        if(hour === 12){
            return 0;
        }
        if(hour >= 1 && hour <= 11){
            return hour;
        }
    }
    else{
        if(hour === 12){
            return hour;
        }
        if(hour >= 1 && hour <= 11){
            return hour + 12;
        }
    }
}

function convertArmyToMeridian(am, hour){
    if(am){
        if(hour === 0){
            return hour + 12;
        }
        if(hour >= 1 && hour <= 11){
            return hour;
        }
    }
    else{
        if(hour === 12){
            return hour;
        }
        if(hour >= 13 && hour <= 23){
            return hour - 12;
        }
    }
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
export { getMin, getDay, getPastDay, sortGoals, date2Day, day2Date, getFutureDate, getDaysToFuture, convertMeridianToArmy, convertArmyToMeridian, MILLS_IN_DAY }