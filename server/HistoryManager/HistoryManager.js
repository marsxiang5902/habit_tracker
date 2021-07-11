'use strict'

const assert = require('assert')
const MILLS_IN_DAY = 1000 * 60 * 60 * 24
const getDay = function (date = new Date()) {
    return Math.floor(date.getTime() / MILLS_IN_DAY)
}
const checkData = function (data, minDaysBefore = 0, maxDaysBefore = 1000000) {
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
            return [];
        }
        static setHistory = function setHistory() { }
    }, MILLS_IN_DAY, getDay, checkData
}