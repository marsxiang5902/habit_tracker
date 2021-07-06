"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col } = require('./db_setup')
const { subclasses } = require('../TimedEvents/TimedEventClasses')

module.exports = {
    addEvent: async function addEvent(user, name, type) { // also adds to event list
        assert(type in subclasses)
        let users_col = get_users_col(), events_col = get_events_col()
        let user_found_res = await users_col.findOne({ user: user })
        if (user_found_res) {
            let newEvent = new subclasses[type](user, name, type)
            let event_add_res = await events_col.insertOne(newEvent)
            return Boolean(event_add_res)
        } return false;
    },
    getEventInfo: function getEventInfo(id) {
        let events_col = get_events_col()
        return events_col.findOne({ id: id })
    }
}