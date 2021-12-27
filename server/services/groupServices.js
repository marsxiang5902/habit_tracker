'use strict'

const { addGroup: db_addGroup, updateGroup: db_updateGroup, removeGroup: db_removeGroup } = require('../database/interactGroup')
const { sliceObject } = require('../lib/wrapSliceObject')
const httpAssert = require('../errors/httpAssert')
const { includeGroup, includeEvent } = require('../database/extractRequestMiddleware')
const { getUserPointsHistory } = require('./userServices')
const { getUser: db_getUser, updateUser: db_updateUser } = require('../database/interactUser')
const sendNotification = require('../Notifications/sendNotification')
const NotificationGroup = require('../Notifications/NotificationGroup')
const NotificationText = require('../Notifications/NotificationText')
const { getEvents: db_getEvents } = require('../database/interactEvent')
const { ObjectId } = require('mongodb');
const { getEvent } = require('./eventServices')


let notFoundAssert = r => {
    httpAssert.NOT_FOUND(r.groupRecord, `Group with ID "${r.group_id}" not found.`)
}
function find(ar, _id) {
    for (let i = 0; i < ar.length; i++) {
        if (ar[i].equals(_id)) {
            return i
        }
    }
    return -1
}

async function addGroup(r, config) {
    let _id = (await db_addGroup(config.user, config.name, config.args || {}))._id
    await includeGroup(r, _id)
    return getGroup(r)
}
const GET_GROUP_SLICES = ['_id', 'user', 'name', 'members', 'roles', 'invites']
function getGroup(r) {
    notFoundAssert(r)
    return sliceObject(r.groupRecord, GET_GROUP_SLICES);
}
async function getGroupData(r) {
    notFoundAssert(r)
    let members = r.groupRecord.members
    let ret = {}
    for (let user in members) {
        ret[user] = { events: {}, pointsHistory: getUserPointsHistory({ user, userRecord: await db_getUser(user) }) }
        let ar = await db_getEvents(members[user])
        let records = await Promise.all(ar.map(eventRecord => getEvent({ ...r, event_id: eventRecord._id, eventRecord })))
        records.forEach(record => {
            ret[user].events[record._id] = record
        })
    }
    return ret;
}
const UPD_GROUP_SLICES = ['name']
async function updateGroup(r, updObj) {
    notFoundAssert(r)
    return await db_updateGroup(r.group_id, r.groupRecord, sliceObject(updObj, UPD_GROUP_SLICES))
}
async function inviteToGroup(r, config) {
    notFoundAssert(r)
    httpAssert.BAD_REQUEST(config.user && await db_getUser(config.user), `User ${config.user} not found.`)
    let user = config.user, invites = r.groupRecord.invites
    if (!invites.includes(user)) {
        invites.push(user)
        await sendNotification(new NotificationGroup(user,
            `New Group Invite: ${r.groupRecord.name}`, '', r.group_id))
        r.groupRecord = await db_updateGroup(r.group_id, r.groupRecord, { invites })
    }
    return getGroup(r)
}
async function removeFromGroup(r, config) {
    notFoundAssert(r)
    httpAssert.BAD_REQUEST(config.user && await db_getUser(config.user), `User ${config.user} not found.`)
    let user = config.user
    httpAssert.BAD_REQUEST(user !== r.groupRecord.user, `Cannot remove the owner ${r.groupRecord.user}.`)
    let invites = r.groupRecord.invites
    if (invites.includes(user)) {
        invites.splice(invites.indexOf(user), 1)
        r.groupRecord = await db_updateGroup(r.group_id, r.groupRecord, { invites })
    }
    if (user in r.groupRecord.members) {
        delete r.groupRecord.members[user]
        delete r.groupRecord.roles[user]
        r.groupRecord = await db_updateGroup(r.group_id, r.groupRecord, {
            members: r.groupRecord.members, roles: r.groupRecord.roles
        })
        await sendNotification(new NotificationText(user,
            `Removed from Group: ${r.groupRecord.name}`, 'text'))
    }
    let userRecord = await db_getUser(user), idx = find(userRecord.groups, r.group_id)
    if (idx != -1) {
        userRecord.groups.splice(idx, 1)
        await db_updateUser(user, userRecord, { groups: userRecord.groups })
    }
    return getGroup(r)
}
async function shareEvent(r, config) {
    notFoundAssert(r)
    httpAssert.BAD_REQUEST(Array.isArray(config.event_ids), "Data is invalid.")
    let ar = await db_getEvents(config.event_ids.map(_id => {
        try {
            return ObjectId(_id)
        } catch { httpAssert.BAD_REQUEST(`_id ${_id} not valid`) }
    }))
    return await db_updateGroup(r.group_id, r.groupRecord, {
        members: { ...r.groupRecord.members, [r.user]: ar.map(eventRecord => eventRecord._id) }
    })
}
async function removeGroup(r) {
    notFoundAssert(r)
    await db_removeGroup(r.group_id, r.groupRecord)
}
module.exports = {
    addGroup, getGroup, getGroupData, updateGroup, inviteToGroup, removeFromGroup,
    shareEvent, removeGroup, GET_GROUP_SLICES, UPD_GROUP_SLICES
}