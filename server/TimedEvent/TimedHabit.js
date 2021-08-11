'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')

const DEFAULT_ARGS = {
    historyManagerType: 'bitmask', activationDaysBit: 127
}

module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, args) {
        // HARDCODE HABITS TO USE BITMASK
        httpAssert.BAD_REQUEST(typeof args == 'object', `Data is invalid.`)
        wrapObject(args, DEFAULT_ARGS, true)
        let historyManagerType = args.historyManagerType
        httpAssert.BAD_REQUEST(historyManagerType in subclasses, `Type ${historyManagerType} is not valid.`)
        super(user, name, 'habit', new subclasses[historyManagerType]())
    }
}