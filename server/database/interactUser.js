"use strict";
const { get_users_col, get_events_col, get_triggers_col } = require('./db_setup')
const User = require('../Users/User')
const httpAssert = require('../errors/httpAssert')


async function addUser(user, userRecord, password) {
    httpAssert.CONFLICT(!userRecord, `User ${user} already exists.`)
    let newUser = new User(user, password)
    await newUser.init()
    await get_users_col().insertOne(newUser);
}
function getUser(user) {
    return get_users_col().findOne({ user: user })
}
async function updateUser(user, userRecord, updObj) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    httpAssert.BAD_REQUEST(updObj && typeof updObj == 'object' && !('_id' in updObj), `Data is invalid.`)
    await get_users_col().updateOne({ user: user }, { "$set": updObj })
    for (let key in updObj) {
        userRecord[key] = updObj[key]
    }
    return userRecord
}
async function removeUser(user, userRecord) {
    // not indexed by id since i don't expect this to get called too much
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    await get_users_col().deleteOne({ user: user })
    await get_events_col().deleteMany({ user: user })
    await get_triggers_col().deleteMany({ user: user })
}

module.exports = { addUser, getUser, updateUser, removeUser }