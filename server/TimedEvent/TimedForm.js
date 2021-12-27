'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')
const HistoryManagerFields = require('../HistoryManager/HistoryManagerFields')
const hasRepeat = require('../lib/hasRepeat')

const DEFAULT_ARGS = {
    checkedHistoryManagerType: 'bitmask', fields: []
}
const CHANGE_LAYOUT_FORMAT = {
    add: [], remove: [], rename: [], perm: []
}

module.exports = class TimedForm extends TimedEvent {
    constructor(user, name, startDay, args) {
        httpAssert.BAD_REQUEST(typeof args == 'object', `Data is invalid.`)
        wrapObject(args, DEFAULT_ARGS, true)

        let checkedHistoryManagerType = args.checkedHistoryManagerType
        httpAssert.BAD_REQUEST(checkedHistoryManagerType in subclasses, `Type ${checkedHistoryManagerType} is not valid.`)
        super(user, name, 'form', startDay, new subclasses[checkedHistoryManagerType](startDay))

        httpAssert.BAD_REQUEST(!hasRepeat(args.fields.map(ar => ar[0])))
        this.fields = args.fields.map(fieldData => fieldData[0])
        this.formHistory = {}
        args.fields.forEach(fieldData => {
            this.formHistory[fieldData[0]] = new HistoryManagerFields(startDay, fieldData[1], 32)
        })
    }
    static reset(eventRecord, dayDiff) {
        for (let field in eventRecord.formHistory) {
            HistoryManagerFields.realignDate(eventRecord.formHistory[field].data, dayDiff)
        }
        return ['formHistory']
    }
    static updateFieldsLayout(eventRecord, updObj, curDay) {
        /*
        [
            [newNameN, fromPrevN?, fromPrevN ? nameN : typeN]
        ]
        */
        httpAssert.BAD_REQUEST(Array.isArray(updObj))
        updObj.forEach(ar => {
            httpAssert.BAD_REQUEST(Array.isArray(ar) && typeof ar[0] === 'string' &&
                typeof ar[1] === 'boolean' && typeof ar[2] === 'string')
        })
        httpAssert.BAD_REQUEST(!hasRepeat(updObj.map(ar => ar[0])))
        httpAssert.BAD_REQUEST(!hasRepeat(updObj.filter(ar => ar[1]).map(ar => ar[2])))

        let formHistory = eventRecord.formHistory, newFormHistory = {}
        updObj.forEach(ar => {
            if (ar[1]) {
                httpAssert.BAD_REQUEST(ar[2] in formHistory)
                newFormHistory[ar[0]] = formHistory[ar[2]]
            } else {
                newFormHistory[ar[0]] = new HistoryManagerFields(curDay, ar[2], 32)
            }
        })
        eventRecord.formHistory = newFormHistory
        eventRecord.fields = updObj.map(ar => ar[0])
    }
    static getFormData(eventRecord, curDay) {
        let ret = {}
        eventRecord.fields.forEach(field => {
            ret[field] = HistoryManagerFields.getHistory(eventRecord.formHistory[field].data, curDay)
        })
        return ret
    }
    static getFormLayout(eventRecord) {
        return eventRecord.fields.map(field => [field, eventRecord.formHistory[field].data.dataType])
    }
    static updateFormData(eventRecord, updObj, curDay) {
        for (let field in updObj) {
            httpAssert.BAD_REQUEST(field in eventRecord.formHistory)
            HistoryManagerFields.setHistory(eventRecord.formHistory[field].data, curDay, updObj[field])
        }
    }
}