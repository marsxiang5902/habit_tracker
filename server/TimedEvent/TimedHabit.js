'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')

const DEFAULT_ARGS = {
    checkedHistoryManagerType: 'bitmask', activationDaysBit: 127
}

module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, startDay, args) {
        // HARDCODE HABITS TO USE BITMASK
        httpAssert.BAD_REQUEST(typeof args == 'object', `Data is invalid.`)
        wrapObject(args, DEFAULT_ARGS, true)
        let checkedHistoryManagerType = args.checkedHistoryManagerType
        httpAssert.BAD_REQUEST(checkedHistoryManagerType in subclasses, `Type ${checkedHistoryManagerType} is not valid.`)
        super(user, name, 'habit', startDay, new subclasses[checkedHistoryManagerType](startDay))
    }
}