function timeSinceStart(time, dayStartTime) {
    return (time - dayStartTime + 1440) % 1440
}
function eventIsActivated(eventRecord, day, min, dayStartTime) {
    return eventRecord.type !== 'todo' && !eventRecord.checkedHistory[0] &&
        eventRecord.activationDays[day] && timeSinceStart(eventRecord.activationTime,
            dayStartTime) <= timeSinceStart(min, dayStartTime)
}
export { timeSinceStart, eventIsActivated }