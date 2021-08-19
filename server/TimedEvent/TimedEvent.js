'use strict'

const { subclasses } = require('../HistoryManager/HistoryManagerClasses')

// parameters passed in args (in derived classes) are specific to them
module.exports = class TimedEvent {
    constructor(user, name, type, startDay, checkedHistoryManager = new subclasses.none(), activationDaysBit = 127) {
        this.user = user
        this.type = type
        this.name = name
        this.checkedHistory = checkedHistoryManager
        this.triggerList = []
        this.activationDaysBit = activationDaysBit
        this.activationTime = 0
    }
    static reset(eventRecord, dayDiff) { return [] }
}
