"use strict";
const assert = require('assert')
const { get_users_col, get_events_col } = require('./db_setup')
const User = require('../Users/User')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')

const USER_UPDATE_ALLOWED_KEYS = new Set(['name']) // api checks frontend updates

async function addUser(user, password) {
    let users_col = get_users_col()
    let res = await users_col.findOne({ user: user })
    if (!res) {
        let newUser = new User(user, password)
        await newUser.init()
        await users_col.insertOne(newUser);
    } else {
        throw new httpStatusErrors.CONFLICT(`User ${user} already exists.`);
    }
}
async function getUser(user) {
    let users_col = get_users_col()
    let res = await users_col.findOne({ user: user })
    if (res) {
        return res;
    } else {
        throw new httpStatusErrors.NOT_FOUND(`User ${user} not found.`)
    }
}
async function updateUser(user, updObj) {
    for (let key in updObj) {
        if (!USER_UPDATE_ALLOWED_KEYS.has(key)) {
            throw new httpStatusErrors.BAD_REQUEST(`Cannot modify property "${key}".`)
        }
    }
    let users_col = get_users_col()
    await getUser(user)
    await users_col.updateOne({ user: user }, { "$set": updObj })
}
async function updateUserRoles(user, roles) {
    // {role1: add?}
    let userRecord = await getUser(user)


}
async function removeUser(user) {
    // not indexed by id since i don't expect this to get called too much
    let events_col = get_events_col(), users_col = get_users_col()
    await getUser(user)
    await users_col.deleteOne({ user: user })
    await events_col.deleteMany({ user: user })
}

module.exports = { addUser, getUser, updateUser, removeUser }