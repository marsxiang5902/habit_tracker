function timeSinceStart(time, dayStartTime) {
    return (time - dayStartTime + 1400) % 1400
}
function eventIsActivated(eventRecord, day, min, dayStartTime) {
    return eventRecord.type !== 'todo' && !eventRecord.history[0] &&
        eventRecord.activationDays[day] && timeSinceStart(eventRecord.activationTime,
            dayStartTime) <= timeSinceStart(min, dayStartTime)
}
export { timeSinceStart, eventIsActivated }