"use strict";
const assert = require('assert')
const { get_events_col, get_triggers_col } = require('./db_setup')
const httpAssert = require('../errors/httpAssert')
const { getEvent } = require('./interactEvent');
const { subclasses } = require('../Trigger/TriggerClasses');


async function addTrigger(user, name, type, event_id, args) {
    httpAssert.BAD_REQUEST(type in subclasses, `Type ${type} not valid.`)
    let eventRecord = getEvent(event_id)
    httpAssert.NOT_FOUND(eventRecord, `Event ${event_id} not found.`)
    let newTrigger = new subclasses[type](user, name, event_id, args)
    let insertResult = await get_triggers_col().insertOne(newTrigger)
    httpAssert.INTERNAL_SERVER(insertResult.insertedCount, `Could not insert.`)
    let _id = insertResult.insertedId
    await get_events_col().updateOne({ _id: event_id }, { "$push": { triggerList: _id } })
    return newTrigger
}
function getTrigger(_id) {
    return get_triggers_col().findOne({ _id: _id })
}
async function getTriggers(_ids) {
    httpAssert.BAD_REQUEST(Array.isArray(_ids), `Data is invalid.`)
    let triggers_cursor = await get_triggers_col().find({ _id: { "$in": _ids } })
    let triggers_array = await triggers_cursor.toArray()
    assert(Array.isArray(triggers_array))
    return triggers_array;
}
async function updateTrigger(_id, triggerRecord, updObj) {
    httpAssert.NOT_FOUND(triggerRecord, `Trigger with id ${_id} not found.`)
    httpAssert.BAD_REQUEST(typeof updObj == 'object' && !('_id' in updObj), `Data is invalid.`)
    await get_triggers_col().updateOne({ _id: _id }, { "$set": updObj })
    for (let key in updObj) {
        triggerRecord[key] = updObj[key]
    }
    return triggerRecord
}
async function removeTrigger(_id, triggerRecord) {
    httpAssert.NOT_FOUND(triggerRecord, `Trigger with id ${_id} not found.`)
    let event_id = triggerRecord.event_id
    await get_events_col().updateOne({ _id: event_id }, { '$pull': { triggerList: _id } })
    await get_triggers_col().deleteOne({ _id: _id })
}

module.exports = {
    addTrigger, getTrigger, getTriggers, updateTrigger, removeTrigger
}