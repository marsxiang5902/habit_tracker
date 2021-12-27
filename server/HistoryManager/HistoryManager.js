'use strict'

const assert = require('assert')
const { getDay } = require('../lib/time')

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
        static realignDate = function realignDate() { }
        static getHistory = function getHistory() {
            return {};
        }
        static setHistory = function setHistory() { }
    }, checkData
}