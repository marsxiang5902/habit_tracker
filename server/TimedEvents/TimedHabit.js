'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')

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
        httpAssert.BAD_REQUEST(historyManagerType in subclasses, `Type ${historyManagerType} is not valid.`)
        super(user, name, 'habit', new subclasses[historyManagerType]())
    }
}