'use strict'

const { subclasses } = require('../HistoryManager/HistoryManagerClasses')

module.exports = class TimedEvent {
    constructor(user, name, type, historyManager = new subclasses.none()) {
        this.user = user
        this.type = type
        this.name = name
        this.historyManager = historyManager
    }
}
