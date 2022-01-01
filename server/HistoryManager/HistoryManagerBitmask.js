"use strict";

const { HistoryManager, checkData } = require('./HistoryManager')
const { getDay } = require('../lib/time');
const httpAssert = require('../errors/httpAssert')
const assert = require('assert');
const { bit2obj } = require('../lib/bitmask');


module.exports = class HistoryManagerBitmask extends HistoryManager {
    constructor(startDay = getDay(), bit = 0) {
        super('bitmask', { startDay: startDay, bit: bit })
    }
    static checkBitmaskData(data) {
        httpAssert.BAD_REQUEST(
            'startDay' in data &&
            'bit' in data &&
            Number.isInteger(data.startDay) &&
            Number.isInteger(data.bit),
            `Data is invalid.`
        )
    }
    static realignDate(data, dayDiff) { // modify data
        data.bit <<= dayDiff
    }
    static getHistory(data, curDay) {
        this.checkBitmaskData(data)
        let daysPassed = curDay - data.startDay + 1
        let ret = bit2obj(data.bit, Math.min(32, daysPassed))
        assert(checkData(ret))
        return ret;
    }
    static setHistory(data, curDay, updObj) {
        this.checkBitmaskData(data)
        let daysPassed = curDay - data.startDay + 1
        httpAssert.BAD_REQUEST(checkData(updObj, daysPassed), `Data is invalid.`)
        for (let key in updObj) {
            let daysBefore = parseInt(key)
            if (updObj[key]) {
                data.bit |= 1 << daysBefore
            } else {
                data.bit &= ~(1 << daysBefore)
            }
        }
    }
}