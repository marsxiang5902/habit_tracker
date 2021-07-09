"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col } = require('./db_setup')
const User = require('../Users/User')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')

module.exports = {
    addUser: async function addUser(user) {
        let users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (!res) {
            let newUser = new User(user)
            await users_col.insertOne(newUser);
        } else {
            throw new httpStatusErrors.CONFLICT(`User ${user} already exists.`);
        }
    },
    getAllUsers: async function getAllUsers() {
        let users_col = get_users_col()
        let cursor = await users_col.find({})
        let ar = await cursor.toArray()
        return ar;
    },
    getUser: async function getUser(user) {
        let users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (res) {
            return res;
        } else {
            throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
        }
    },
    getUserEvents: async function getUserEvents(user, eventLists) {
        let users_col = get_users_col(), events_col = get_events_col()
        if (!eventLists) {
            let res = await users_col.findOne({ user: user })
            if (res) {
                eventLists = res.eventLists
            } else {
                throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
            }
        }
        let ret = {}
        for (let type in subclasses) {
            assert(type in eventLists)
            let events_cursor = await events_col.find({ _id: { "$in": eventLists[type] } })
            let events_array = await events_cursor.toArray()
            assert(Array.isArray(events_array))
            ret[type] = events_array
        }
        return ret;
    },
    updateUser: async function updateUser(user, updObj) {
        if ('user' in updObj) {
            throw new httpStatusErrors.BAD_REQUEST(`Cannot modify property "user".`)
        }
        let users_col = get_users_col()
        let res = users_col.findOne({ user: user })
        if (!res) {
            throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
        } else {
            await users_col.updateOne({ user: user }, { "$set": updObj })
        }
    }
}