'use strict'

const { subclasses } = require('../HistoryManager/HistoryManagerClasses')

// parameters passed in args (in derived classes) are specific to them
module.exports = class TimedEvent {
    constructor(user, name, type, historyManager = new subclasses.none()) {
        this.user = user
        this.type = type
        this.name = name
        this.historyManager = historyManager
    }
}
