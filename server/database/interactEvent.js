"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col, get_event_lists_col } = require('./db_setup')
const { subclasses } = require('../TimedEvents/TimedEventClasses')

module.exports = {
    addEvent: async function addEvent(user, name, type) { // also adds to event list
        assert(type in subclasses)
        let users_col = get_users_col(), events_col = get_events_col(), event_lists_col = get_event_lists_col()
        let user_found_res = await users_col.findOne({ user: user }),
            event_list_found_res = await event_lists_col.findOne({ user: user, type: type })
        if (user_found_res && event_list_found_res) {
            let newEvent = new subclasses[type](user, name)
            let event_add_res = await events_col.insertOne(newEvent);
            if (event_add_res) {
                let id = event_add_res.ops[0]._id
                let event_list_add_res = await event_lists_col.updateOne({ user: user, type: type }, { "$push": { ar: id } })
                return Boolean(event_list_add_res);
            } else {
                return false;
            }
        } else {
            return false;
        }
    },
    getEventInfo: function getEventInfo(id) {
        let events_col = get_events_col()
        return events_col.findOne({ id: id })
    }
}