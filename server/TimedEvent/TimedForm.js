'use strict'

const TimedEvent = require('./TimedEvent')
const { subclasses } = require('../HistoryManager/HistoryManagerClasses')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')
const HistoryManagerFields = require('../HistoryManager/HistoryManagerFields')

const DEFAULT_ARGS = {
    checkedHistoryManagerType: 'bitmask', activationDaysBit: 127,
    fields: []
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
        this.fields = args.fields.map(fieldData => fieldData[0])
        this.formHistory = {}
        args.fields.forEach(fieldData => {
            this.formHistory[fieldData[0]] = new HistoryManagerFields(startDay, fieldData[1], 32)
        })
    }
    static reset(eventRecord, dayDiff) {
        for (let field in eventRecord.formHistory) {
            HistoryManagerFields.realignDate(eventRecord.formHistory[field], dayDiff)
        }
        return ['formHistory']
    }
    static updateFieldsLayout(eventRecord, updObj, curDay) {
        // {add: [[fieldN, typeN]], rename: [[oldNameN, newNameN]], remove: [fieldN], perm: [permutation]}
        httpAssert.BAD_REQUEST(typeof updObj === 'object' && updObj !== null)
        eventRecord.fields.forEach(field => {
            httpAssert.INTERNAL_SERVER(field in eventRecord.formHistory)
            HistoryManagerFields.checkFieldData(eventRecord.formHistory[field].data)
        })
        wrapObject(updObj, CHANGE_LAYOUT_FORMAT, true)
        let history = eventRecord.formHistory
        let [add, rename, remove, perm] = [updObj.add, updObj.rename, updObj.remove, updObj.perm]
        for (let action in CHANGE_LAYOUT_FORMAT) {
            for (let i = 0; i < updObj[action].length; i++) {
                let elem = updObj[action][i]
                httpAssert.BAD_REQUEST((action === 'perm' || action === 'remove') ||
                    (Array.isArray(elem) && elem.length === 2), 'Data is invalid.')
            }
        }
        for (let i = 0; i < add.length; i++) {
            let elem = add[i]
            history[elem[0]] = new HistoryManagerFields(curDay, elem[1], 32)
        }
        for (let i = 0; i < remove.length; i++) {
            delete history[remove[i]]
        }
        let mergeObj = {}
        for (let i = 0; i < rename.length; i++) {
            let elem = rename[i]
            mergeObj[elem[1]] = history[elem[0]]
            delete history[elem[0]]
        }
        history = { ...history, ...mergeObj }
        httpAssert.BAD_REQUEST(perm.length === Object.keys(history).length &&
            (new Set(perm)).size === Object.keys(history).length, 'Data is invalid.')
        for (let i = 0; i < perm.length; i++) {
            httpAssert.BAD_REQUEST(perm[i] in history, 'Data is invalid.')
        }
        eventRecord.formHistory = history
        eventRecord.fields = perm
    }
    static getFormData(eventRecord, curDay) {
        return eventRecord.fields.map(field => [field, HistoryManagerFields.getHistory(eventRecord.formHistory[field].data, curDay)])
    }
    static updateFormData(eventRecord, updObj, curDay) {
        for (let field in updObj) {
            httpAssert.BAD_REQUEST(field in eventRecord.formHistory)
            HistoryManagerFields.setHistory(eventRecord.formHistory[field].data, updObj[field], curDay)
        }
    }
}