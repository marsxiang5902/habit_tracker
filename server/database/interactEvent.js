"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col } = require('./db_setup')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')

module.exports = {
    addEvent: async function addEvent(user, name, type, args) { // also adds to event list
        if (!(type in subclasses)) {
            throw new httpStatusErrors.BAD_REQUEST(`Type ${type} not valid.`)
        }
        let users_col = get_users_col(), events_col = get_events_col()
        let user_found_res = await users_col.findOne({ user: user })
        if (user_found_res) {
            let newEvent = new subclasses[type](user, name, args)
            await events_col.insertOne(newEvent)
        } else {
            throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
        }
    },
    getEvent: function getEvent(_id) { // ONLY FOR ADMINS
        let events_col = get_events_col()
        return events_col.findOne({ _id: _id })
    },
    updateEvent: async function updateEvent(_id, updObj) {
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
}