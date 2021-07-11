"use strict";

const { HistoryManager, MILLS_IN_DAY, getDay, checkData } = require('./HistoryManager')
const httpStatusErrors = require('../errors/httpStatusErrors')
const assert = require('assert')

module.exports = class HistoryManagerBitmask extends HistoryManager {
    constructor(date = getDay(new Date()), bit = 0) {
        super('bitmask', { date: date, bit: bit })
    }
    static realignDate(data) {
        if (!('date' in data) || !('bit' in data) || !Number.isInteger(data.date) || !Number.isInteger(data.bit)) {
            throw new httpStatusErrors.BAD_REQUEST("Data is not valid.")
        }
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
        if (!checkData(updObj)) {
            throw new httpStatusErrors.BAD_REQUEST(`Data is not valid.`)
        }
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