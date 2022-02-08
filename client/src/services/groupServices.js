import makeRequest from "../api/makeRequest"
import update from 'immutability-helper'

async function addGroup(context, name, args = {}) {
    let res = await makeRequest('groups', 'POST', {
        user: context.session.user, name, args
    }, context.session.jwt)
    if (!res.error) {
        return update(context, { session: { groups: { [res.data._id]: { "$set": res.data } } } })
    } return context
}
async function getGroupData(context, groupId) {
    let res = await makeRequest(`groups/${groupId}/data`, 'GET', {}, context.session.jwt)
    return res.error ? {} : res.data
}
async function updateEvent(context, event, updObj) {
    let res = await makeRequest(`events/${event._id}`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, { timedEvents: { [event.type]: { [event._id]: { "$set": res.data } } } })
    } return context
}
async function updateEventHistory(context, event, updObj) {
    let res = await makeRequest(`events/${event._id}/history`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, { timedEvents: { [event.type]: { [event._id]: { "$set": res.data } } } })
    } return context
}
async function updateEventFormLayout(context, event, updObj) {
    if (event.type === 'form') {
        let res = await makeRequest(`events/${event._id}/form/layout`, 'PUT', updObj, context.session.jwt)
        if (!res.error) {
            return update(context, { timedEvents: { form: { [event._id]: { "$set": res.data } } } })
        } return context
    }
}
async function updateEventFormHistory(context, event, updObj) {
    if (event.type === 'form') {
        let res = await makeRequest(`events/${event._id}/form`, 'PUT', updObj, context.session.jwt)
        if (!res.error) {
            return update(context, { timedEvents: { form: { [event._id]: { "$set": res.data } } } })
        } return context
    }
}

async function deleteEvent(context, event) {
    let res = await makeRequest(`events/${event._id}`, 'DELETE', {}, context.session.jwt)
    if (!res.error) {
        return update(context, { timedEvents: { [event.type]: { "$unset": [event._id] } } })
    } return context
}


export { addGroup, getGroupData, updateEvent, updateEventFormLayout, updateEventFormHistory, deleteEvent, updateEventHistory }