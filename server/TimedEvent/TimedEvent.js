'use strict'

const { subclasses } = require('../HistoryManager/HistoryManagerClasses')

// parameters passed in args (in derived classes) are specific to them
module.exports = class TimedEvent {
    constructor(user, name, type, startDay, checkedHistoryManager = new subclasses.none(),
        activationDaysBit = 127, color = 0, points = 10) {
        this.user = user
        this.type = type
        this.name = name
        this.checkedHistory = checkedHistoryManager
        this.triggerList = []
        this.activationDaysBit = activationDaysBit
        this.activationTime = 0
        this.color = color
        this.starred = false
        this.points = points
    }
    static reset(eventRecord, dayDiff) { return [] }
}
