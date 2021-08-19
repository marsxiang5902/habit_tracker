'use strict'

const { addTrigger: db_addTrigger, updateTrigger: db_updateTrigger, removeTrigger: db_removeTrigger } = require('../database/interactTrigger')
const { sliceObject } = require('../lib/wrapSliceObject')
const httpAssert = require('../errors/httpAssert')
const { ObjectId } = require('mongodb')
const { includeTrigger } = require('../database/extractRequestMiddleware')

let notFoundAssert = r => {
    httpAssert.NOT_FOUND(r.triggerRecord, `Trigger with ID "${r.trigger_id}" not found.`)
}

async function addTrigger(r, config) {
    let event_id = config.event_id
    try {
        event_id = ObjectId(event_id)
    } finally {
        let _id = (await db_addTrigger(config.user, config.name, config.type, event_id, config.args || {}))._id
        await includeTrigger(r, _id)
        return getTrigger(r)
    }
}
const GET_TRIGGER_SLICES = ['_id', 'user', 'name', 'type', 'event_id', 'resourceURL', 'topText', 'bottomText']
function getTrigger(r) {
    notFoundAssert(r)
    return sliceObject(r.triggerRecord, GET_TRIGGER_SLICES);
}
const UPD_TRIGGER_SLICES = ['name', 'resourceURL', 'topText', 'bottomText']
async function updateTrigger(r, updObj) {
    notFoundAssert(r)
    return await db_updateTrigger(r.trigger_id, r.triggerRecord, sliceObject(updObj, UPD_TRIGGER_SLICES))
}
async function removeTrigger(r) {
    notFoundAssert(r)
    await db_removeTrigger(r.trigger_id, r.triggerRecord)
}

module.exports = {
    addTrigger, getTrigger, updateTrigger, removeTrigger, GET_TRIGGER_SLICES, UPD_TRIGGER_SLICES
}