"use strict";

const { HistoryManager, MILLS_IN_DAY, getDay, checkData } = require('./HistoryManager')
const httpAssert = require('../errors/httpAssert')
const assert = require('assert')

module.exports = class HistoryManagerBitmask extends HistoryManager {
    constructor(date = getDay(new Date()), bit = 0) {
        super('bitmask', { date: date, bit: bit })
    }
    static realignDate(data) {
        httpAssert.BAD_REQUEST(
            'date' in data &&
            'bit' in data &&
            Number.isInteger(data.date) &&
            Number.isInteger(data.bit),
            `Data is invalid.`
        )
        let realDate = getDay()
        let dateDiff = realDate - data.date
        data.date = realDate
        data.bit <<= dateDiff
    }
    static getHistory(data) {
        this.realignDate(data)
        let ret = {}
        for (let i = 0; i < 32; i++) {
            ret[i] = (data.bit & (1 << i)) != 0
        }
        assert(checkData(ret))
        return ret;
    }
    static setHistory(data, updObj) {
        httpAssert.BAD_REQUEST(checkData(updObj), `Data is invalid.`)
        this.realignDate(data)
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