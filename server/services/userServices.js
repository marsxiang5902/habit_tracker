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

let notFoundAssert = r => {
    httpAssert.NOT_FOUND(r.userRecord, `User "${r.user}" not found.`)
}

const USER_GET_SLICES = ['user', 'email', 'dayStartTime']
function getUser(r) {
    notFoundAssert(r)
    return { ...sliceObject(r.userRecord, USER_GET_SLICES), perms: Array.from(getPerms(r.userRecord.roles)) }
}
function getUserAuth(r) {
    notFoundAssert(r)
    return sliceObject(r.userRecord, ['password_hashed'])
}
async function getUserEvents(r) {
    notFoundAssert(r)
    let eventLists = r.userRecord.eventLists
    let ret = {}
    for (let type in eventLists) {
        ret[type] = {}
        let ar = await db_getEvents(eventLists[type].map(_id => ObjectId(_id)))
        let records = await Promise.all(ar.map(eventRecord => getEvent({ ...r, event_id: eventRecord._id, eventRecord })))
        records.forEach(record => {
            ret[type][record._id] = record
        })
    }
    return ret;
}
const USER_UPD_SLICES = ['email', 'dayStartTime']
async function updateUser(r, updObj) {
    notFoundAssert(r)
    if ('email' in updObj) {
        httpAssert.CONFLICT(!await getUserByEmail(updObj.email), `Email ${updObj.email} is taken.`)
    }
    return getUser({ ...r, userRecord: await db_updateUser(r.user, r.userRecord, sliceObject(updObj, USER_UPD_SLICES)) })
}
async function newDay(r) {
    notFoundAssert(r)
    let curDay = getDay(r.userRecord.dayStartTime), dayDiff = curDay - r.userRecord.lastLoginDay
    if (dayDiff > 0) {
        for (let type in r.userRecord.eventLists) {
            let eventsAr = await db_getEvents(r.userRecord.eventLists[type].map(_id => ObjectId(_id)))
            for (let i = 0; i < eventsAr.length; i++) {
                let eventRecord = eventsAr[i]
                let ch = eventRecord.checkedHistory
                HistoryManagerSubclasses[ch.type].realignDate(ch.data, dayDiff)
                let subset = TimedEventSubclasses[eventRecord.type].reset(eventRecord, dayDiff)
                await db_updateEvent(eventRecord._id, eventRecord, sliceObject(eventRecord, ['checkedHistory', ...subset]))
            }
        }
        await db_updateUser(user, userRecord, { lastLoginDay: curDay, })
    }
    return { dayDiff }
}
async function removeUser(r) {
    notFoundAssert(r)
    await db_removeUser(r.user, r.userRecord)
}

module.exports = {
    getUser, getUserAuth, getUserEvents, updateUser, newDay, removeUser
}