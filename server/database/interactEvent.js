"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col } = require('./db_setup')
const { subclasses: eventSubclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { subclasses: historyManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')

async function addEvent(user, name, type, args) {
    // also adds to user's event list
    // args are given to events to handle
    if (!(type in eventSubclasses)) {
        throw new httpStatusErrors.BAD_REQUEST(`Type ${type} not valid.`)
    }
    let users_col = get_users_col(), events_col = get_events_col()
    let user_found_res = await users_col.findOne({ user: user })
    if (user_found_res) {
        let newEvent = new eventSubclasses[type](user, name, args)
        let res = await events_col.insertOne(newEvent)
        if (res.insertedCount == 0) {
            throw new httpStatusErrors.INTERNAL_SERVER(`Could not insert.`)
        } else {
            let _id = res.insertedId
            await users_col.updateOne(
                { user: user },
                { "$push": { [`eventLists.${type}`]: _id } }
            )
        }
    } else {
        throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
    }
}

async function getEvent(_id) {
    let events_col = get_events_col()
    let res = await events_col.findOne({ _id: _id })
    if (!res) {
        throw new httpStatusErrors.NOT_FOUND(`Event with id ${_id} not found.`)
    }
    return res;
}

async function getEvents(_ids) {
    if (!Array.isArray(_ids)) {
        throw new httpStatusErrors.BAD_REQUEST(`Query data not valid.`)
    }
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
        if (!res) {
            throw new httpStatusErrors.NOT_FOUND(`Event with id ${_id} not found.`)
        }
        historyManager = res.historyManager
    }
    if (!(historyManager.type in historyManagerSubclasses)) {
        throw new httpStatusErrors.BAD_REQUEST(`Type ${historyManager.type} not valid.`)
    }
    return historyManagerSubclasses[historyManager.type].getHistory(historyManager.data)
}

const EVENT_UPDATE_ALLOWED_KEYS = new Set(['name', 'historyManager']) // api checks frontend updates
async function updateEvent(_id, updObj) {
    for (let key in updObj) {
        if (!EVENT_UPDATE_ALLOWED_KEYS.has(key)) {
            throw new httpStatusErrors.BAD_REQUEST(`Cannot modify property "${key}".`)
        }
    }
    let events_col = get_events_col()
    let res = await events_col.findOneAndUpdate({ _id: _id }, { "$set": updObj })
    if (!res) {
        throw new httpStatusErrors.NOT_FOUND(`Event with id ${_id} not found.`)
    }
}

async function updateEventHistory(_id, updObj, historyManager) {
    let events_col = get_events_col()
    if (!historyManager) {
        let res = await events_col.findOne({ _id: _id })
        if (res) {
            historyManager = res.historyManager
        } else {
            throw new httpStatusErrors.NOT_FOUND(`Event with id ${id} not found.`)
        }
    } else {
        if (!('type' in historyManager) || !(historyManager.type in historyManagerSubclasses) || !('data' in historyManager)) {
            throw new httpStatusErrors.BAD_REQUEST(`Data not valid.`)
        }
    }
    historyManagerSubclasses[historyManager.type].setHistory(historyManager.data, updObj)
    await updateEvent(_id, { historyManager: historyManager })
}

module.exports = { addEvent, getEvent, getEvents, getEventHistory, updateEvent, updateEventHistory }