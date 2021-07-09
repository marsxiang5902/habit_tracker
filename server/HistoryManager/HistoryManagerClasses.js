'use strict'

const { HistoryManager } = require('./HistoryManager')
const HistoryManagerBitmask = require('./HistoryManagerBitmask')
const HistoryManagerNone = require('./HistoryManagerNone')

module.exports = {
    superclass: HistoryManager,
    subclasses: {
        bitmask: HistoryManagerBitmask,
        none: HistoryManagerNone
    }
}