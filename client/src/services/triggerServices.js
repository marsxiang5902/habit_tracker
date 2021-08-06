import makeRequest from "../api/makeRequest"
import update from 'immutability-helper'

function getEventTypes(events) {
    let ids2type = {}
    for (let type in events) {
        for (let _id in events[type]) {
            ids2type[_id] = type
        }
    }
    return ids2type
}
function updateTriggerObject(context, trigger, updObj) {
    return {
        timedEvents: {
            [context.eventIds2Type[trigger.event_id]]
                : { [trigger.event_id]: { triggers: { [trigger._id]: updObj } } }
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
                [context.eventIds2Type[trigger.event_id]]
                    : {
                    [trigger.event_id]: {
                        triggers: { "$unset": [trigger._id] }
                    }
                }
            }
        })
    } return context
}


export { getEventTypes, addTrigger, updateTrigger, deleteTrigger }