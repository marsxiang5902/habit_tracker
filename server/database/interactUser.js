"use strict";
const { assert } = require('console')
const { get_users_col, get_event_lists_col, get_events_col } = require('./db_setup')
const User = require('../Users/User')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const { addEventList } = require('./interactEventList')

module.exports = {
    addUser: async function addUser(user) {
        let users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (!res) {
            let newUser = new User(user)
            let all_lists_added = true
            for (let type in subclasses) {
                all_lists_added &= await addEventList(user, type)
            }
            await users_col.insertOne(newUser);
            return all_lists_added;
        } else {
            return false;
        }
    },
    getUserInfo: function getUserInfo(user) {
        let users_col = get_users_col()
        return users_col.findOne({ user: user })
    },
    getUserEvents: async function getUserEvents(user) {
        let users_col = get_users_col(), event_lists_col = get_event_lists_col(), events_col = get_events_col()
        let res = users_col.findOne({ user: user })
        if (res) {
            let ret = {}
            let event_lists_cursor = await event_lists_col.find({ user: user })
            let event_lists_array = await event_lists_cursor.toArray();
            assert(event_lists_array.length == Object.keys(subclasses).length)
            for (let i = 0; i < event_lists_array.length; i++) {
                let events_cursor = await events_col.find({ _id: { "$in": event_lists_array[i].ar } })
                ret[event_lists_array[i].type] = await events_cursor.toArray()
            }
            return ret;
        } return null;
    }
}