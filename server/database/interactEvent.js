"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col } = require('./db_setup')
const { subclasses: eventSubclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { subclasses: historyMangagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')

async function addEvent(user, name, type, args) {
    // also adds to user's event list
    // args are given to events tohandle
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

function getEvent(_id) { // ONLY FOR ADMINS?
    let events_col = get_events_col()
    let res = events_col.findOne({ _id: _id })
    if (!res) {
        throw new httpStatusErrors.NOT_FOUND(`Event with id ${_id} not found.`)
    }
    return res;
}

function getEventHistory(_id) {
    let events_col = get_events_col()
    let res = events_col.findOne({ _id: _id })
    if (!res) {
        throw new httpStatusErrors.NOT_FOUND(`Event with id ${_id} not found.`)
    }
    let historyManager = res.historyManager
    if (!(historyManager.type in historyMangaerSubclasses)) {
        throw new httpStatusErrors.BAD_REQUEST(`Type ${historyManager.type} not valid.`)
    }
    return historyMangagerSubclasses[historyManager.type].getHistory(historyManager.data)
}

async function updateEvent(_id, updObj) {
    if ('_id' in updObj) {
        throw new httpStatusErrors.BAD_REQUEST(`Cannot modify property "_id".`)
    }
    let events_col = get_events_col()
    let res = events_col.findOne({ _id: _id })
    if (!res) {
        throw new httpStatusErrors.NOT_FOUND(`Event with id ${id} not found.`)
    } else {
        await users_col.updateOne({ _id: _id }, { "$set": updObj })
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
    }
    historyMangagerSubclasses[historyManager.type].setHistory(updObj)
}

module.exports = { addEvent, getEvent, getEventHistory, updateEvent, updateEventHistory }