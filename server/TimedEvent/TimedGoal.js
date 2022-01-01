'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')

const DEFAULT_ARGS = {
    checkedHistoryManagerType: 'bitmask',
}

module.exports = class TimedGoal extends TimedEvent {
    constructor(user, name, startDay, args) {
        httpAssert.BAD_REQUEST(typeof args == 'object', `Data is invalid.`)
        wrapObject(args, DEFAULT_ARGS, true)
        let checkedHistoryManagerType = args.checkedHistoryManagerType
        httpAssert.BAD_REQUEST(checkedHistoryManagerType in subclasses, `Type ${checkedHistoryManagerType} is not valid.`)
        super(user, name, 'goal', startDay, new subclasses[checkedHistoryManagerType](startDay))
        this.endDay = 1e9
        this.goalTarget = { event_id: '', value: 0, formField: '' }
    }
}