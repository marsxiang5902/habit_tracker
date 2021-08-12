'use strict'

const { getUser: db_getUser } = require('../database/interactUser')
const { addEvent: db_addEvent, updateEvent: db_updateEvent, removeEvent: db_removeEvent } = require('../database/interactEvent')
const { getTriggers: db_getTriggers } = require('../database/interactTrigger')
const { getTrigger } = require('./triggerServices')
const { subclasses: historyManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
const { sliceObject, wrapObject } = require('../lib/wrapSliceObject')
const httpAssert = require('../errors/httpAssert')
const { ObjectId } = require('mongodb')
const { bit2obj, obj2bit } = require('../lib/bitmask')

// CAN ONLY TAKE <= 1 PARAMETER AFTER _ID AND EVENTRECORD

async function addEvent(config) {
    let userRecord = db_getUser(config.user)
    let res = await db_addEvent(config.user, config.name, config.type, userRecord.lastLoginDay, config.args || {})
    return await getEvent(res._id, res)
}
const EVENT_GET_SLICES = ['_id', 'user', 'name', 'type', 'activationTime', 'nextEvent', 'eventList', 'pointer']
async function getEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let ret = sliceObject(eventRecord, EVENT_GET_SLICES)

    ret.history = await getEventHistory(_id, eventRecord)
    let triggerList = eventRecord.triggerList

    let ar = await db_getTriggers(triggerList.map(_id => ObjectId(_id)))
    let records = ar.map(triggerRecord => getTrigger(triggerRecord._id, triggerRecord))
    ret.triggers = {}
    records.forEach(record => {
        ret.triggers[record._id] = record
    })

    ret.activationDays = bit2obj(eventRecord.activationDaysBit, 7)
    return ret;
}
async function getEventHistory(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let hm = eventRecord.historyManager
    return historyManagerSubclasses[hm.type].getHistory(hm.data, (await db_getUser(eventRecord.user)).lastLoginDay)
}
const EVENT_UPD_SLICES = ['name', 'activationDaysBit', 'activationTime', 'nextEvent', 'eventList', 'pointer']
async function updateEvent(_id, eventRecord, updObj) {

    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    if ('activationDays' in updObj) {
        wrapObject(updObj.activationDays, bit2obj(eventRecord.activationDaysBit, 7))
        updObj.activationDaysBit = obj2bit(updObj.activationDays, 7)
    }

    return await getEvent(_id, await db_updateEvent(_id, eventRecord, sliceObject(updObj, EVENT_UPD_SLICES)))
}
async function updateEventHistory(_id, eventRecord, updObj) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let hm = eventRecord.historyManager
    historyManagerSubclasses[hm.type].setHistory(hm.data, (await db_getUser(eventRecord.user)).lastLoginDay, updObj)
    return await getEvent(_id, await db_updateEvent(_id, eventRecord, { historyManager: hm }))
}
async function removeEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    await db_removeEvent(_id, eventRecord)
}

module.exports = {
    addEvent, getEvent, getEventHistory, updateEvent, updateEventHistory, removeEvent, EVENT_GET_SLICES, EVENT_UPD_SLICES
}