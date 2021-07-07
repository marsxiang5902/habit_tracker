"use strict";
const { assert } = require('console')
const { get_users_col, get_events_col } = require('./db_setup')
const User = require('../Users/User')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const Api404Error = require('../errors/api404Error')

module.exports = {
    addUser: async function addUser(user) {
        let users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (!res) {
            let newUser = new User(user)
            await users_col.insertOne(newUser);
            return true;
        } else {
            return false;
        }
    },
    getAllUsers: async function getAllUsers() {
        let users_col = get_users_col()
        let cursor = await users_col.find({})
        let ar = await cursor.toArray()
        return ar
    },
    getUser: async function getUser(user) {
        let users_col = get_users_col()
        let res = await users_col.findOne({ user: user })
        if (res) {
            return res;
        } else {
            throw new Api404Error(`User ${user} not found.`)
        }
    },
    getUserEvents: async function getUserEvents(user) {
        let users_col = get_users_col(), events_col = get_events_col()
        let res = users_col.findOne({ user: user })
        if (res) {
            let ret = {}
            for (let type in subclasses) {
                ret[type] = []
            }
            let events_cursor = await events_col.find({ user: user })
            await events_cursor.forEach(doc => {
                assert(Array.isArray(ret[doc.type]))
                ret[doc.type].push(doc)
            })
            return ret;
        } else {
            throw new Api404Error(`User ${user} not found.`)
        }
    }
}