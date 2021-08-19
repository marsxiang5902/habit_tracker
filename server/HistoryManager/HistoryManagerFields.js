"use strict";

const { HistoryManager, checkData } = require('./HistoryManager')
const { getDay } = require('../lib/time');
const httpAssert = require('../errors/httpAssert')
const assert = require('assert');

const DATA_TYPES_DEFAULTS = { num: 0, str: '', select: '' }

module.exports = class HistoryManagerFields extends HistoryManager {
    constructor(startDay = getDay(), dataType = 'num', dayLimit = 32) {
        httpAssert.BAD_REQUEST(dataType in DATA_TYPES_DEFAULTS)
        super('field', { startDay, dataType, history: { 0: DATA_TYPES_DEFAULTS[dataType] }, dayLimit })
    }
    static checkFieldData(data) {
        httpAssert.BAD_REQUEST(
            'startDay' in data &&
            'history' in data &&
            'dayLimit' in data &&
            Number.isInteger(data.startDay) &&
            typeof data.history === 'object' && data.history !== null,
            Number.isInteger(data.dayLimit),
            `Data is invalid.`
        )
    }
    static realignDate(data, dayDiff) { // modify data
        let newHistory = {}
        for (let key in data.history) {
            let newKey = parseInt(key) + dayDiff
            if (newKey < data.dayLimit) {
                newHistory[newKey] = data.history[key]
            }
        }
        data.history = newHistory
    }
    static getHistory(data, curDay) {
        this.checkFieldData(data)
        let daysPassed = curDay - data.startDay + 1
        assert(checkData(data.history, daysPassed))
        return data.history;
    }
    static setHistory(data, updObj, curDay) {
        this.checkFieldData(data)
        let daysPassed = curDay - data.startDay + 1
        httpAssert.BAD_REQUEST(checkData(updObj, daysPassed), `Data is invalid.`)
        for (let key in updObj) {
            httpAssert.BAD_REQUEST(typeof updObj[key] === typeof DATA_TYPES_DEFAULTS[data.dataType])
            data.history[key] = updObj[key]
        }
    }
}