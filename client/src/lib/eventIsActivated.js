import noCheckedHistory from "./noCheckedHistory"
import notDashboard from "./notDashboard"

function timeSinceStart(time, dayStartTime) {
    return (time - dayStartTime + 1440) % 1440
}
function eventIsActivated(eventRecord, day, min, dayStartTime) {
    // return !noCheckedHistory.has(eventRecord.type) && !eventRecord.checkedHistory[0] &&
    //     eventRecord.activationDays[day] && timeSinceStart(eventRecord.activationTime,
    //         dayStartTime) <= timeSinceStart(min, dayStartTime)
    return !notDashboard.has(eventRecord.type) && !eventRecord.checkedHistory[0] &&
        eventRecord.activationDays[day] && timeSinceStart(eventRecord.activationTime,
            dayStartTime) <= timeSinceStart(min, dayStartTime)
}
function eventActiveToday(eventRecord) {
    let today = new Date()
    today = today.getDay()
    return today === 0 ? eventRecord.activationDays[6] : eventRecord.activationDays[today - 1]
}
export { timeSinceStart, eventIsActivated, eventActiveToday }