'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')
const { ObjectId } = require('mongodb')

const DEFAULT_ARGS = {
    checkedHistoryManagerType: 'bitmask',
    eventList: [], pointer: 0
}

module.exports = class TimedReward extends TimedEvent {
    constructor(user, name, startDay, args) {
        httpAssert.BAD_REQUEST(typeof args == 'object', `Data is invalid.`)
        wrapObject(args, DEFAULT_ARGS, true)
        let checkedHistoryManagerType = args.checkedHistoryManagerType
        httpAssert.BAD_REQUEST(checkedHistoryManagerType in subclasses, `Type ${checkedHistoryManagerType} is not valid.`)
        super(user, name, 'stack', startDay, new subclasses[checkedHistoryManagerType](startDay))
        this.eventList = []
        try {
            for (let i = 0; i < args.eventList.length; i++) {
                this.eventList.push(ObjectId(args.eventList[i]))
            }
        } catch (err) {
            this.eventList = []
        }
        this.pointer = Math.min(args.pointer, this.eventList.length)
    }
    static reset(eventRecord) {
        eventRecord.pointer = 0;
        return ['pointer']
    }
}