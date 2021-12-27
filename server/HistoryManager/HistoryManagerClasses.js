'use strict'

const { HistoryManager } = require('./HistoryManager')
const HistoryManagerBitmask = require('./HistoryManagerBitmask')
const HistoryManagerFields = require('./HistoryManagerFields')
const HistoryManagerNone = require('./HistoryManagerNone')

module.exports = {
    superclass: HistoryManager,
    subclasses: {
        bitmask: HistoryManagerBitmask,
        field: HistoryManagerFields,
        none: HistoryManagerNone
    }
}