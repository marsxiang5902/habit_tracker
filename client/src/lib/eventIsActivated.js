import noCheckedHistory from "./noCheckedHistory"

function timeSinceStart(time, dayStartTime) {
    return (time - dayStartTime + 1440) % 1440
}
function eventIsActivated(eventRecord, day, min, dayStartTime) {
    return !noCheckedHistory.has(eventRecord.type) && !eventRecord.checkedHistory[0] &&
        eventRecord.activationDays[day] && timeSinceStart(eventRecord.activationTime,
            dayStartTime) <= timeSinceStart(min, dayStartTime)
}
function eventActiveToday(eventRecord){
    let today = new Date()
    today = today.getDay()
    return eventRecord.activationDays[today]
}
export { timeSinceStart, eventIsActivated, eventActiveToday }