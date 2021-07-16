"use strict";
const assert = require('assert')
const { get_users_col, get_events_col } = require('./db_setup')
const { subclasses: eventSubclasses } = require('../TimedEvents/TimedEventClasses')
const httpAssert = require('../errors/httpAssert')
const { subclasses: historyManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
const { ObjectId } = require('mongodb');


async function addEvent(user, name, type, args) {
    // also adds to user's event list
    // args are given to events to handle
    httpAssert.BAD_REQUEST(type in eventSubclasses, `Type ${type} not valid.`)
    let users_col = get_users_col(), events_col = get_events_col()
    let user_found_res = await users_col.findOne({ user: user })
    httpAssert.NOT_FOUND(user_found_res, `User ${user} not valid.`)
    let newEvent = new eventSubclasses[type](user, name, args)
    let res = await events_col.insertOne(newEvent)
    httpAssert.INTERNAL_SERVER(res.insertedCount, `Could not insert.`)
    let _id = res.insertedId
    await users_col.updateOne(
        { user: user },
        { "$push": { [`eventLists.${type}`]: _id } }
    )
}

async function getEvent(_id) {
    let events_col = get_events_col()
    let res = await events_col.findOne({ _id: _id })
    httpAssert.NOT_FOUND(res, `Event with id ${_id} not found.`)
    return res;
}

async function getEvents(_ids) {
    httpAssert.BAD_REQUEST(Array.isArray(_ids), `Data is invalid.`)
    let events_col = get_events_col()
    let events_cursor = await events_col.find({ _id: { "$in": _ids } })
    let events_array = await events_cursor.toArray()
    assert(Array.isArray(events_array))
    return events_array;
}

async function getEventHistory(_id, historyManager) {
    if (!historyManager) {
        let events_col = get_events_col()
        let res = await events_col.findOne({ _id: _id })
        httpAssert.NOT_FOUND(res, `Event with id ${_id} not found.`)
        historyManager = res.historyManager
    }
    httpAssert.BAD_REQUEST(historyManager.type in historyManagerSubclasses,
        `Type ${historyManager.type} not valid.`)
    return historyManagerSubclasses[historyManager.type].getHistory(historyManager.data)
}

const EVENT_UPDATE_ALLOWED_KEYS = new Set(['name', 'historyManager'])
async function updateEvent(_id, updObj) {
    for (let key in updObj) {
        httpAssert.BAD_REQUEST(EVENT_UPDATE_ALLOWED_KEYS.has(key), `Cannot modify property "${key}".`)
    }
    let events_col = get_events_col()
    let res = await events_col.findOneAndUpdate({ _id: _id }, { "$set": updObj })
    httpAssert.NOT_FOUND(res.value, `Event with id ${_id} not found.`)
}

async function updateEventHistory(_id, updObj, historyManager) {
    let events_col = get_events_col()
    if (!historyManager) {
        let res = await events_col.findOne({ _id: _id })
        httpAssert.NOT_FOUND(res, `Event with id ${id} not found.`)
        historyManager = res.historyManager
    } else {
        httpAssert.BAD_REQUEST(
            'type' in historyManager &&
            historyManager.type in historyManagerSubclasses &&
            'data' in historyManager,
            `Data is invalid.`)
    }
    historyManagerSubclasses[historyManager.type].setHistory(historyManager.data, updObj)
    await updateEvent(_id, { historyManager: historyManager })
}

async function removeEvent(_id) {
    let events_col = get_events_col(), users_col = get_users_col()
    let events_res = await events_col.findOne({ _id: _id })
    httpAssert.NOT_FOUND(events_res, `Event with id ${_id} not found.`)
    let user = events_res.user, type = events_res.type
    let users_res = await users_col.findOne({ user: user })
    httpAssert.INTERNAL_SERVER(users_res, `Event has invalid user.`)
    events_col.deleteOne({ _id: _id })
    users_col.updateOne({ user: user }, { "$pull": { [`eventLists.${type}`]: _id } })
}

async function extractEventMiddleware(req, res, next) {
    let _id = req.params._id;
    try {
        _id = ObjectId(_id)
        req.body._id = _id
    } catch (err) { } finally {
        let events_col = get_events_col()
        let eventRecord = await events_col.findOne({ _id: req.params._id })
        req.resource = eventRecord
        next()
    }
}

module.exports = {
    addEvent, getEvent, getEvents, getEventHistory, updateEvent, updateEventHistory,
    removeEvent, extractEventMiddleware
}