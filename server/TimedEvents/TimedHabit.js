'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')

const DEFAULT_ARGS = {
    historyManagerType: 'bitmask'
}

module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, args) {
        // HARDCODE HABITS TO USE BITMASK
        if (!args) args = {}
        for (let key in DEFAULT_ARGS) {
            if (!(key in args)) {
                args[key] = DEFAULT_ARGS[key]
            }
        }
        let historyManagerType = args.historyManagerType
        if (!(historyManagerType in subclasses)) {
            throw new httpStatusErrors.BAD_REQUEST(`Type ${historyManagerType} is not valid.`)
        } else {
            super(user, name, 'habit', new subclasses[historyManagerType]())
        }
    }
}