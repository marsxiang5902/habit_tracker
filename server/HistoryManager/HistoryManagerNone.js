"use strict";

const { HistoryManager, MILLS_IN_DAY, getDay } = require('./HistoryManager')
module.exports = class HistoryManagerBitmask extends HistoryManager {
    constructor() {
        super('none', null)
    }
    static getCompletedAt() {
        return null
    }
    static setCompletedAt() { }
}