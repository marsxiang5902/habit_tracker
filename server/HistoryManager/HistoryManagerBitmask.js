"use strict";

const { HistoryManager, MILLS_IN_DAY, getDay } = require('./HistoryManager')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { assert } = require('console')

module.exports = class HistoryManagerBitmask extends HistoryManager {
    constructor(date = getDay(new Date()), bit = 0) {
        super('bitmask', { date: date, bit: bit })
    }
    static realignDate(data) {
        if (!('date' in data) || !('bit' in data)) {
            throw new httpStatusErrors.BAD_REQUEST("Data is not valid.")
        }
        let realDate = getDay()
        let dateDiff = realDate - data.date
        data.date = realDate
        data.bit <<= dateDiff
    }
    static getHistory(data) {
        if (!Number.isInteger(daysBefore) || daysBefore > 31) {
            throw new httpStatusErrors.BAD_REQUEST(`${daysBefore} is not valid.`)
        }
        this.realignDate(data)
        let ret = {}
        for (let i = 0; i < 32; i++) {
            ret[i] = (data.bit & (1 << i)) > 0
        }
        return ret;
    }
    static setHistory(data, updObj) {
        this.realignDate(data)
        for (let key in updObj) {
            try {
                let daysBefore = parseInt(key)
                assert(Number.isInteger(daysBefore) && 0 >= daysBefore && daysBefore <= 31)
            } catch (err) {
                throw new httpStatusErrors.BAD_REQUEST(`Update data is not valid.`)
            }
            if (updObj[key]) {
                data |= 1 << daysBefore
            } else {
                data &= ~(1 << daysBefore)
            }
        }
    }
}