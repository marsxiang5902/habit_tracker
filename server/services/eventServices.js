'use strict'

const { addEvent: db_addEvent, updateEvent: db_updateEvent, removeEvent: db_removeEvent } = require('../database/interactEvent')
const { getTriggers: db_getTriggers } = require('../database/interactTrigger')
const { getTrigger } = require('./triggerServices')
const { subclasses: historyManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
const { sliceObject } = require('../lib/wrapSliceObject')
const httpAssert = require('../errors/httpAssert')
const { ObjectId } = require('mongodb')

// CAN ONLY TAKE <= 1 PARAMETER AFTER _ID AND EVENTRECORD

async function addEvent(config) {
    await db_addEvent(config.user, config.name, config.type, config.args || {})
}
const EVENT_SLICES = ['_id', 'user', 'name', 'type']
async function getEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let ret = sliceObject(eventRecord, EVENT_SLICES)
    ret.history = getEventHistory(_id, eventRecord)
    let triggerList = eventRecord.triggerList
    let ar = await db_getTriggers(triggerList.map(_id => ObjectId(_id)))
    let records = ar.map(triggerRecord => getTrigger(triggerRecord._id, triggerRecord))
    ret.triggers = {}
    records.forEach(record => {
        ret.triggers[record._id] = record
    })
    return ret;
}
function getEventHistory(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let hm = eventRecord.historyManager
    return historyManagerSubclasses[hm.type].getHistory(hm.data)
}
async function updateEvent(_id, eventRecord, updObj) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    return await db_updateEvent(_id, eventRecord, sliceObject(updObj, ['name']))
}
async function updateEventHistory(_id, eventRecord, updObj) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let hm = eventRecord.historyManager
    historyManagerSubclasses[hm.type].setHistory(hm.data, updObj)
    return await db_updateEvent(_id, eventRecord, { historyManager: hm })
}
async function removeEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    await db_removeEvent(_id, eventRecord)
}

module.exports = {
    addEvent, getEvent, getEventHistory, updateEvent, updateEventHistory, removeEvent, EVENT_SLICES
}