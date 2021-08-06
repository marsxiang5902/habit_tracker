'use strict'

const { addTrigger: db_addTrigger, updateTrigger: db_updateTrigger, removeTrigger: db_removeTrigger } = require('../database/interactTrigger')
const { sliceObject } = require('../lib/wrapSliceObject')
const httpAssert = require('../errors/httpAssert')
const { ObjectId } = require('mongodb')

async function addTrigger(config) {
    let event_id = config.event_id
    try {
        event_id = ObjectId(event_id)
    } catch (err) { } finally {
        let res = await db_addTrigger(config.user, config.name, config.type, event_id, config.args || {})
        return getTrigger(res._id, res)
    }
}
const TRIGGER_SLICES = ['_id', 'user', 'name', 'type', 'event_id', 'resourceURL', 'topText', 'bottomText']
function getTrigger(_id, triggerRecord) {
    httpAssert.NOT_FOUND(triggerRecord, `Trigger with id ${_id} not found.`)
    return sliceObject(triggerRecord, TRIGGER_SLICES);
}
async function updateTrigger(_id, triggerRecord, updObj) {
    httpAssert.NOT_FOUND(triggerRecord, `Trigger with id ${_id} not found.`)
    return await db_updateTrigger(_id, triggerRecord, sliceObject(updObj, ['name', 'resourceURL', 'topText', 'bottomText']))
}
async function removeTrigger(_id, triggerRecord) {
    httpAssert.NOT_FOUND(triggerRecord, `Trigger with id ${_id} not found.`)
    await db_removeTrigger(_id, triggerRecord)
}

module.exports = {
    addTrigger, getTrigger, updateTrigger, removeTrigger, TRIGGER_SLICES
}