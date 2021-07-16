"use strict";
const assert = require('assert')
const { get_users_col, get_events_col } = require('./db_setup')
const User = require('../Users/User')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpAssert = require('../errors/httpAssert')

// all these require the mongodb document so middleware that extracts it makes sense

async function addUser(user, password) {
    let users_col = get_users_col()
    let res = await users_col.findOne({ user: user })
    httpAssert.CONFLICT(!res, `User ${user} already exists.`)
    let newUser = new User(user, password)
    await newUser.init()
    await users_col.insertOne(newUser);
}
async function getUser(user) {
    let users_col = get_users_col()
    let res = await users_col.findOne({ user: user })
    httpAssert.NOT_FOUND(res, `User ${user} not found.`)
    return res;
}
const USER_UPDATE_ALLOWED_KEYS = new Set(['name'])
async function updateUser(user, updObj) {
    for (let key in updObj) {
        httpAssert.BAD_REQUEST(USER_UPDATE_ALLOWED_KEYS.has(key), `Cannot modify property "${key}".`)
    }
    let users_col = get_users_col()
    await getUser(user)
    await users_col.updateOne({ user: user }, { "$set": updObj })
}
async function updateUserRoles(user, roles) { }
async function removeUser(user) {
    // not indexed by id since i don't expect this to get called too much
    let events_col = get_events_col(), users_col = get_users_col()
    await getUser(user)
    await users_col.deleteOne({ user: user })
    await events_col.deleteMany({ user: user })
}

async function extractUserMiddleware(req, res, next) {
    let users_col = get_users_col()
    let userRecord = await users_col.findOne({ user: req.params.user })
    req.resource = userRecord
    next()
}

module.exports = { addUser, getUser, updateUser, removeUser, extractUserMiddleware }