"use strict";
const assert = require('assert')
const { get_users_col, get_events_col } = require('./db_setup')
const { subclasses: eventSubclasses } = require('../TimedEvents/TimedEventClasses')
const httpAssert = require('../errors/httpAssert')


async function addEvent(user, name, type, args) {
    // also adds to user's event list
    // args are given to events to handle
    httpAssert.BAD_REQUEST(type in eventSubclasses, `Type ${type} not valid.`)
    let userRecord = await get_users_col().findOne({ user: user })
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    let newEvent = new eventSubclasses[type](user, name, args)
    let insertResult = await get_events_col().insertOne(newEvent)
    httpAssert.INTERNAL_SERVER(insertResult.insertedCount, `Could not insert.`)
    let _id = insertResult.insertedId
    await get_users_col().updateOne(
        { user: user },
        { "$push": { [`eventLists.${type}`]: _id } }
    )
}
async function getEvents(_ids) {
    httpAssert.BAD_REQUEST(Array.isArray(_ids), `Data is invalid.`)
    let events_cursor = await get_events_col().find({ _id: { "$in": _ids } })
    let events_array = await events_cursor.toArray()
    assert(Array.isArray(events_array))
    return events_array;
}
async function updateEvent(_id, eventRecord, updObj) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    httpAssert.BAD_REQUEST(typeof updObj == 'object' && !('_id' in updObj), `Data is invalid.`)
    await get_events_col().updateOne({ _id: _id }, { "$set": updObj })
}
async function removeEvent(_id, eventRecord) {
    httpAssert.NOT_FOUND(eventRecord, `Event with id ${_id} not found.`)
    let user = eventRecord.user, type = eventRecord.type
    get_events_col().deleteOne({ _id: _id })
    get_users_col().updateOne({ user: user }, { '$pull': { [`eventLists.${type}`]: _id } })
}

module.exports = {
    addEvent, getEvents, updateEvent, removeEvent
}