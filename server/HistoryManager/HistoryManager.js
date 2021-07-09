'use strict'

const MILLS_IN_DAY = 1000 * 60 * 60 * 24, MOD = 4294967296
const getDay = function (date = new Date()) {
    return Math.floor(date.getTime() / MILLS_IN_DAY)
}

// stored in the form of {data, getHistory, setHistory}
module.exports = {
    HistoryManager: class HistoryManager {
        // gethistory is in the form of an object: {daysbefore: data}
        // sethistory is in the form of an object: {daysbefore: data}
        constructor(type, data) {
            this.type = type
            this.data = data
        }
        static getHistory = function getHistory() {
            return null;
        }
        static setHistory = function setHistory() { }
    }, MILLS_IN_DAY, getDay
}