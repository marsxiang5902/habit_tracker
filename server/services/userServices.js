'use strict'

const httpAssert = require('../errors/httpAssert')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { removeUser: db_removeUser } = require('../database/interactUser')
const { getEvents: db_getEvents } = require('../database/interactEvent')
const { ObjectId } = require('mongodb')
const { sliceObject } = require('../lib/wrapSliceObject')
const { getPerms } = require('../permissions/roles')
const { getEvent } = require('./eventServices')
// CAN ONLY TAKE <= 1 PARAMETER AFTER USER AND USERRECORD

function getUser(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    let ret = sliceObject(userRecord, ['user'])
    ret.perms = Array.from(getPerms(userRecord.roles))
    return ret
}
function getUserAuth(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    return sliceObject(userRecord, ['password_hashed'])
}
async function getUserEvents(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    let eventLists = userRecord.eventLists
    let ret = {}
    for (let type in eventLists) {
        try {
            ret[type] = {}
            let ar = await db_getEvents(eventLists[type].map(_id => ObjectId(_id)))
            let records = await Promise.all(ar.map(eventRecord => getEvent(eventRecord._id, eventRecord)))
            records.forEach(record => {
                ret[type][record._id] = record
            })
        } catch (err) {
            throw new httpStatusErrors.BAD_REQUEST(`Data is invalid.`)
        }
    }
    return ret;
}
async function removeUser(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    await db_removeUser(user, userRecord)
}

module.exports = {
    getUser, getUserAuth, getUserEvents, removeUser
}