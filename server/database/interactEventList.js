"use strict";
const { assert } = require('console')
const { get_event_lists_col } = require('./db_setup')
const EventList = require('../EventLists/EventList')

module.exports = {
    addEventList: async function addEventList(user, type) {
        let event_lists_col = get_event_lists_col()
        let res = await event_lists_col.findOne({ user: user, type: type })
        if (!res) {
            let newEventList = new EventList(user, type)
            await event_lists_col.insertOne(newEventList)
            return true;
        } else {
            return false;
        }
    },
    getEventInfo: function getEventInfo(user, type) {
        let event_lists_col = get_event_lists_col()
        return event_lists_col.findOne({ user: user, type: type })
    }
}