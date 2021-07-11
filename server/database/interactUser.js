"use strict";
const assert = require('assert')
const { get_users_col, get_events_col } = require('./db_setup')
const User = require('../Users/User')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')

const USER_UPDATE_ALLOWED_KEYS = new Set(['name']) // api checks frontend updates

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
    // getAllUsers: async function getAllUsers() {
    //     let users_col = get_users_col()
    //     let cursor = await users_col.find({})
    //     let ar = await cursor.toArray()
    //     return ar;
    // },
    getUser: async function getUser(user) {
        let users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (res) {
            return res;
        } else {
            throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
        }
    },
    // getUserEvents: async function getUserEvents(user, eventLists) {
    //     let users_col = get_users_col(), events_col = get_events_col()
    //     if (!eventLists) {
    //         let res = await users_col.findOne({ user: user })
    //         if (res) {
    //             eventLists = res.eventLists
    //         } else {
    //             throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
    //         }
    //     }
    //     let ret = {}
    //     for (let type in subclasses) {
    //         assert(type in eventLists)
    //         let events_cursor = await events_col.find({ _id: { "$in": eventLists[type] } })
    //         let events_array = await events_cursor.toArray()
    //         assert(Array.isArray(events_array))
    //         ret[type] = events_array
    //     }
    //     return ret;
    // },
    updateUser: async function updateUser(user, updObj) {
        for (let key in updObj) {
            if (!USER_UPDATE_ALLOWED_KEYS.has(key)) {
                throw new httpStatusErrors.BAD_REQUEST(`Cannot modify property "${key}".`)
            }
        }
        let users_col = get_users_col()
        let res = users_col.findOne({ user: user })
        if (res) {
            await users_col.updateOne({ user: user }, { "$set": updObj })
        } else {
            throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
        }
    },
    removeUser: async function removeUser(user) {
        // not indexed by id since i don't expect this to get called too much
        let events_col = get_events_col(), users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (res) {
            await users_col.deleteOne({ user: user })
            console.log(await events_col.deleteMany({ user: user }))
        } else {
            throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
        }
    }
}