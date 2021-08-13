"use strict";

const { HistoryManager } = require('./HistoryManager')
module.exports = class HistoryManagerNone extends HistoryManager {
    constructor() {
        super('none', null)
    }
}