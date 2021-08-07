import makeRequest from "../api/makeRequest"
import update from 'immutability-helper'
import { getEventById } from "../lib/locateEvents"

function updateTriggerObject(context, trigger, updObj) {
    return {
        timedEvents: {
            [getEventById(context, trigger.event_id).type]: {
                [trigger.event_id]: { triggers: { [trigger._id]: updObj } }
            }
        }
    }
}


async function addTrigger(context, name, type, event_id, args = {}) {
    let res = await makeRequest('triggers', 'POST', {
        user: context.session.user, name, type, event_id, args
    }, context.session.jwt)
    if (!res.error) {
        return update(context, updateTriggerObject(context, res.data, { "$set": res.data }))
    } return context
}

async function updateTrigger(context, trigger, updObj) {
    let res = await makeRequest(`triggers/${trigger._id}`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, updateTriggerObject(context, trigger, { "$set": res.data }))
    } return context
}

async function deleteTrigger(context, trigger) {
    let res = await makeRequest(`triggers/${trigger._id}`, 'DELETE', {}, context.session.jwt)
    if (!res.error) {
        return update(context, {
            timedEvents: {
                [getEventById(context, trigger.event_id).type]: {
                    [trigger.event_id]: { triggers: { "$unset": [trigger._id] } }
                }
            }
        })
    } return context
}


export { addTrigger, updateTrigger, deleteTrigger }