'use strict'

const assert = require('assert')
const MILLS_IN_MIN = 1000 * 60, MILLS_IN_DAY = MILLS_IN_MIN * 60 * 24
const getDay = function (date = new Date()) {
    // HARDCODE: USE LOCAL TIMEZONE OFFSET
    return Math.floor((date.getTime() - date.getTimezoneOffset() * MILLS_IN_MIN) / MILLS_IN_DAY)
}
const checkData = function (data, maxDaysBefore = getDay(), minDaysBefore = 0) {
    // check if data is in the form of a object: {daysbefore: data}
    try {
        for (let key in data) {
            let daysBefore = parseInt(key)
            assert(Number.isInteger(daysBefore) && minDaysBefore <= daysBefore && daysBefore <= maxDaysBefore)
        }
    } catch (err) {
        console.log(err)
        return false
    }
    return true
}

// stored in the form of {data, getHistory, setHistory}
module.exports = {
    HistoryManager: class HistoryManager {
        constructor(type, data) {
            this.type = type
            this.data = data
        }
        static getHistory = function getHistory() {
            return {};
        }
        static setHistory = function setHistory() { }
    }, MILLS_IN_MIN, MILLS_IN_DAY, getDay, checkData
}