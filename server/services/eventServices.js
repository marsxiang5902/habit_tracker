'use strict'

const { addEvent: db_addEvent, updateEvent: db_updateEvent, removeEvent: db_removeEvent } = require('../database/interactEvent')
const { subclasses: historyManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
const { sliceObject } = require('./wrapSliceObject')
const httpAssert = require('../errors/httpAssert')

// CAN ONLY TAKE <= 1 PARAMETER AFTER _ID AND EVENTRECORD

async function addEvent(config) {
    await db_addEvent(config.user, config.name, config.type, config.args || {})
}
const EVENT_SLICES = ['_id', 'user', 'name', 'type', 'resourceURL']
function getEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let ret = sliceObject(eventRecord, EVENT_SLICES)
    ret.history = getEventHistory(_id, eventRecord)
    return ret;
}
function getEventHistory(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let hm = eventRecord.historyManager
    return historyManagerSubclasses[hm.type].getHistory(hm.data)
}
async function updateEvent(_id, eventRecord, updObj) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    sliceObject(updObj, ['name', 'resourcePointer'])
    await db_updateEvent(_id, eventRecord, updObj)
}
async function updateEventHistory(_id, eventRecord, updObj) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let hm = eventRecord.historyManager
    historyManagerSubclasses[hm.type].setHistory(hm.data, updObj)
    await db_updateEvent(_id, eventRecord, { historyManager: hm })
}
async function removeEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    await db_removeEvent(_id, eventRecord)
}

module.exports = {
    addEvent, getEvent, getEventHistory, updateEvent, updateEventHistory, removeEvent, EVENT_SLICES
}