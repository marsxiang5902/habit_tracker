'use strict'

const httpAssert = require('../errors/httpAssert')
const { updateUser: db_updateUser, removeUser: db_removeUser, getUserByEmail } = require('../database/interactUser')
const { getEvents: db_getEvents, updateEvent: db_updateEvent } = require('../database/interactEvent')
const { ObjectId } = require('mongodb')
const { sliceObject } = require('../lib/wrapSliceObject')
const { getPerms } = require('../permissions/roles')
const { getEvent } = require('./eventServices')
const { getDay } = require('../lib/time')
const { subclasses: TimedEventSubclasses } = require('../TimedEvent/TimedEventClasses')
const { subclasses: HistoryManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
// CAN ONLY TAKE <= 1 PARAMETER AFTER USER AND USERRECORD

const USER_GET_SLICES = ['user', 'email', 'dayStartTime']
function getUser(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    let ret = sliceObject(userRecord, USER_GET_SLICES)
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
        ret[type] = {}
        let ar = await db_getEvents(eventLists[type].map(_id => ObjectId(_id)))
        let records = await Promise.all(ar.map(eventRecord => getEvent(eventRecord._id, eventRecord)))
        records.forEach(record => {
            ret[type][record._id] = record
        })
    }
    return ret;
}
const USER_UPD_SLICES = ['email', 'dayStartTime']
async function updateUser(user, userRecord, updObj) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    if ('email' in updObj) {
        httpAssert.CONFLICT(!await getUserByEmail(updObj.email), `Email ${updObj.email} is taken.`)
    }
    return getUser(user, await db_updateUser(user, userRecord, sliceObject(updObj, USER_UPD_SLICES)))
}
async function newDay(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    let curDay = getDay(userRecord.dayStartTime), dayDiff = curDay - userRecord.lastLoginDay
    dayDiff = 1
    if (dayDiff > 0) {
        for (let type in userRecord.eventLists) {
            let eventsAr = await db_getEvents(userRecord.eventLists[type].map(_id => ObjectId(_id)))
            for (let i = 0; i < eventsAr.length; i++) {
                let eventRecord = eventsAr[i]
                let hm = eventRecord.historyManager
                HistoryManagerSubclasses[hm.type].realignDate(hm.data, dayDiff)
                let subset = TimedEventSubclasses[eventRecord.type].reset(eventRecord, dayDiff)
                console.log(await db_updateEvent(eventRecord._id, eventRecord, sliceObject(eventRecord, ['historyManager', ...subset])))
            }
        }
        await db_updateUser(user, userRecord, { lastLoginDay: curDay, })
    }
    return { dayDiff };
}
async function removeUser(user, userRecord) {
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    await db_removeUser(user, userRecord)
}

module.exports = {
    getUser, getUserAuth, getUserEvents, updateUser, newDay, removeUser
}