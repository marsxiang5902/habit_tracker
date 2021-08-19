'use strict'

const { addEvent: db_addEvent, updateEvent: db_updateEvent, removeEvent: db_removeEvent } = require('../database/interactEvent')
const { getTriggers: db_getTriggers } = require('../database/interactTrigger')
const { getTrigger } = require('./triggerServices')
const { subclasses: historyManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
const { sliceObject, wrapObject } = require('../lib/wrapSliceObject')
const httpAssert = require('../errors/httpAssert')
const { ObjectId } = require('mongodb')
const { bit2obj, obj2bit } = require('../lib/bitmask')
const { includeUser, includeEvent } = require('../database/extractRequestMiddleware')
const TimedForm = require('../TimedEvent/TimedForm')

let notFoundAssert = r => {
    httpAssert.NOT_FOUND(r.eventRecord, `Event with ID "${r.event_id}" not found.`)
}
let assertFormMiddleware = (req, res, next) => {
    try {
        let r = req.resource
        notFoundAssert(r)
        httpAssert.BAD_REQUEST(r.eventRecord.type === 'form', `Event with ID "${r.event_id}" is not a form.`)
    } catch (err) { next(err) } finally { next() }
}

async function addEvent(r, config) {
    await includeUser(r, config.user)
    let _id = (await db_addEvent(config.user, config.name, config.type,
        r.userRecord.lastLoginDay, config.args || {}))._id
    await includeEvent(r, _id)
    return await getEvent(r)
}
const EVENT_GET_SLICES = ['_id', 'user', 'name', 'type', 'activationTime', 'nextEvent', 'eventList', 'pointer']
async function getEvent(r) {
    notFoundAssert(r)
    let ret = sliceObject(r.eventRecord, EVENT_GET_SLICES)

    ret.checkedHistory = await getEventHistory(r)
    let triggerList = r.eventRecord.triggerList

    let ar = await db_getTriggers(triggerList.map(_id => ObjectId(_id)))
    let records = ar.map(triggerRecord => getTrigger({ trigger_id: triggerRecord._id, triggerRecord }))
    ret.triggers = {}
    records.forEach(record => {
        ret.triggers[record._id] = record
    })

    ret.activationDays = bit2obj(r.eventRecord.activationDaysBit, 7)

    if (r.eventRecord.type === 'form') {
        ret.formData = getEventFormHistory(r)
    }
    return ret;
}
async function getEventHistory(r) {
    notFoundAssert(r)
    let ch = r.eventRecord.checkedHistory
    return historyManagerSubclasses[ch.type].getHistory(ch.data, r.userRecord.lastLoginDay)
}
function getEventFormHistory(r) {
    notFoundAssert(r)
    return TimedForm.getFormData(r.eventRecord, r.userRecord.lastLoginDay)
}

const EVENT_UPD_SLICES = ['name', 'activationDaysBit', 'activationTime', 'nextEvent', 'eventList', 'pointer']
async function updateEvent(r, updObj) {
    notFoundAssert(r)
    if ('activationDays' in updObj) {
        wrapObject(updObj.activationDays, bit2obj(eventRecord.activationDaysBit, 7))
        updObj.activationDaysBit = obj2bit(updObj.activationDays, 7)
    }
    return await getEvent({
        ...r,
        eventRecord: await db_updateEvent(r.event_id, r.eventRecord, sliceObject(updObj, EVENT_UPD_SLICES))
    })
}
async function updateEventHistory(r, updObj) {
    notFoundAssert(r)
    let ch = r.eventRecord.checkedHistory
    historyManagerSubclasses[ch.type].setHistory(ch.data, r.userRecord.lastLoginDay, updObj)
    return await getEvent({
        ...r, eventRecord:
            await db_updateEvent(r.event_id, r.eventRecord, { checkedHistory: ch })
    })
}
async function updateEventFormLayout(r, updObj) {
    notFoundAssert(r)
    TimedForm.updateFieldsLayout(r.eventRecord, updObj, r.userRecord.curDay)
    return await getEvent({
        ...r, eventRecord:
            await db_updateEvent(r.event_id, r.eventRecord, { fields: r.eventRecord.fields, formHistory: r.eventRecord.formHistory })
    })
}
async function updateEventFormHistory(r, updObj) {
    notFoundAssert(r)
    TimedForm.updateFormData(r.eventRecord, updObj, r.userRecord.lastLoginDay)
    return await getEvent({
        ...r, eventRecord:
            await db_updateEvent(r.event_id, r.eventRecord, { formHistory: r.eventRecord.formHistory })
    })
}

async function removeEvent(r) {
    notFoundAssert(r)
    await db_removeEvent(r.event_id, r.eventRecord)
}

module.exports = {
    addEvent, getEvent, getEventHistory, getEventFormHistory, updateEvent, updateEventHistory,
    updateEventFormLayout, updateEventFormHistory, removeEvent, EVENT_GET_SLICES, EVENT_UPD_SLICES, assertFormMiddleware
}