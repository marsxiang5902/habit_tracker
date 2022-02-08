'use strict'

const httpAssert = require('../errors/httpAssert')
const { getUser: db_getUser, updateUser: db_updateUser, removeUser: db_removeUser, getUserByEmail } = require('../database/interactUser')
const { getEvents: db_getEvents, updateEvent: db_updateEvent } = require('../database/interactEvent')
const { ObjectId } = require('mongodb')
const { sliceObject } = require('../lib/wrapSliceObject')
const { getPerms } = require('../permissions/roles')
const { getEvent } = require('./eventServices')
const { getDay } = require('../lib/time')
const { subclasses: TimedEventSubclasses } = require('../TimedEvent/TimedEventClasses')
const { subclasses: HistoryManagerSubclasses } = require('../HistoryManager/HistoryManagerClasses')
const HistoryManagerFields = require('../HistoryManager/HistoryManagerFields')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { includeGroup } = require('../database/extractRequestMiddleware')
const { updateGroup: db_updateGroup } = require('../database/interactGroup')

let notFoundAssert = r => {
    httpAssert.NOT_FOUND(r.userRecord, `User "${r.user}" not found.`)
}

const USER_GET_SLICES = ['user', 'email', 'preferences', 'groups', 'notificationHistory']
function getUser(r) {
    notFoundAssert(r)
    return {
        ...sliceObject(r.userRecord, USER_GET_SLICES),
        pointsHistory: getUserPointsHistory(r),
        perms: Array.from(getPerms(r.userRecord.roles))
    }
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
function getUserPointsHistory(r) {
    notFoundAssert(r)
    let ph = r.userRecord.pointsHistory
    return HistoryManagerFields.getHistory(ph.data, r.userRecord.lastLoginDay)
}

const USER_UPD_SLICES = ['email', 'preferences']
async function updateUser(r, updObj) {
    notFoundAssert(r)
    if ('email' in updObj) {
        httpAssert.CONFLICT(!await getUserByEmail(updObj.email), `Email ${updObj.email} is taken.`)
    }
    return getUser({ ...r, userRecord: await db_updateUser(r.user, r.userRecord, sliceObject(updObj, USER_UPD_SLICES)) })
}
async function newDay(r) {
    notFoundAssert(r)
    let curDay = getDay(r.userRecord.preferences.dayStartTime), dayDiff = curDay - r.userRecord.lastLoginDay
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
        HistoryManagerFields.realignDate(r.userRecord.pointsHistory.data, dayDiff)
        await db_updateUser(r.user, r.userRecord, { pointsHistory, lastLoginDay: curDay })
    }
    return { dayDiff }
}
async function updateUserPointsHistory(r, updObj) {
    notFoundAssert(r)
    let ph = r.userRecord.pointsHistory
    HistoryManagerFields.setHistory(ph.data, r.userRecord.lastLoginDay, updObj)
    return getUser({
        ...r, userRecord:
            await db_updateUser(r.user, r.userRecord, { pointsHistory: ph })
    })
}
async function joinGroup(r, config) {
    notFoundAssert(r)
    let user = r.user, _id = config.group_id
    try {
        _id = ObjectId(_id)
    } catch { throw new httpStatusErrors.BAD_REQUEST('_id invalid.') }
    httpAssert.BAD_REQUEST(await includeGroup(r, _id), `Group with id ${_id} not found.`)
    let invites = r.groupRecord.invites
    if (invites.includes(user)) {
        invites.splice(invites.indexOf(user), 1)
        await db_updateGroup(r.group_id, r.groupRecord, {
            invites,
            members: { ...r.groupRecord.members, [user]: [] },
            roles: { ...r.groupRecord.roles, [user]: ['default'] }
        })
        r.userRecord = await db_updateUser(user, r.userRecord, { groups: r.userRecord.groups.concat([_id]) })
    }
    return getUser(r)
}
async function removeUser(r) {
    notFoundAssert(r)
    await db_removeUser(r.user, r.userRecord)
}

module.exports = {
    getUser, getUserAuth, getUserEvents, getUserPointsHistory, updateUser, newDay,
    updateUserPointsHistory, joinGroup, removeUser
}