"use strict";

const { HistoryManager, MILLS_IN_DAY, getDay, checkData } = require('./HistoryManager')
const httpAssert = require('../errors/httpAssert')
const assert = require('assert')

module.exports = class HistoryManagerBitmask extends HistoryManager {
    constructor(startDay = getDay(), curDay = getDay(), bit = 0) {
        super('bitmask', { startDay: startDay, curDay: curDay, bit: bit })
    }
    static checkBitmaskData(data) {
        httpAssert.BAD_REQUEST(
            'startDay' in data &&
            'curDay' in data &&
            'bit' in data &&
            Number.isInteger(data.startDay) &&
            Number.isInteger(data.curDay) &&
            Number.isInteger(data.bit),
            `Data is invalid.`
        )
    }
    static realignDate(data) {
        let realDay = getDay()
        let dayDiff = realDay - data.curDay
        data.curDay = realDay
        data.bit <<= dayDiff
        return realDay - data.startDay
    }
    static getHistory(data) {
        this.checkBitmaskData(data)
        let daysPassed = this.realignDate(data)
        let ret = {}
        for (let i = 0; i < Math.min(32, daysPassed + 1); i++) {
            ret[i] = (data.bit & (1 << i)) != 0
        }
        assert(checkData(ret))
        return ret;
    }
    static setHistory(data, updObj) {
        this.checkBitmaskData(data)
        let daysPassed = this.realignDate(data)
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