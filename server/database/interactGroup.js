"use strict";
const assert = require('assert')
const { get_users_col, get_groups_col } = require('./db_setup')
const httpAssert = require('../errors/httpAssert');
const { getUser } = require('./interactUser');
const Group = require('../Groups/Group');

async function addGroup(user, name, args) {
    let userRecord = getUser(user)
    httpAssert.NOT_FOUND(userRecord, `User ${user} not found.`)
    let newGroup = new Group(user, name)
    let insertResult = await get_groups_col().insertOne(newGroup)
    httpAssert.INTERNAL_SERVER(insertResult.insertedCount, `Could not insert.`)
    let _id = insertResult.insertedId
    await get_users_col().updateOne({ user }, { "$push": { groups: _id } })
    return newGroup
}
function getGroup(_id) {
    return get_groups_col().findOne({ _id })
}
async function getGroups(_ids) {
    httpAssert.BAD_REQUEST(Array.isArray(_ids), `Data is invalid.`)
    let groups_cursor = await get_groups_col().find({ _id: { "$in": _ids } })
    let groups_array = await groups_cursor.toArray()
    assert(Array.isArray(groups_array))
    return groups_array;
}
async function updateGroup(_id, groupRecord, updObj) {
    httpAssert.NOT_FOUND(groupRecord, `Group with id ${_id} not found.`)
    httpAssert.BAD_REQUEST(typeof updObj == 'object' && !('_id' in updObj), `Data is invalid.`)
    await get_groups_col().updateOne({ _id }, { "$set": updObj })
    return { ...groupRecord, ...updObj }
}
async function removeGroup(_id, groupRecord) {
    httpAssert.NOT_FOUND(groupRecord, `Group with id ${_id} not found.`)
    let users_col = get_users_col()
    for (let user in groupRecord.members) {
        await users_col.updateOne({ user }, { '$pull': { groups: _id } })
    }
    await get_groups_col().deleteOne({ _id })
}

module.exports = {
    addGroup, getGroup, getGroups, updateGroup, removeGroup
}