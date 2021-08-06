import makeRequest from "../api/makeRequest"
import update from 'immutability-helper'

async function addEvent(context, name, type, args = {}) {
    let res = await makeRequest('events', 'POST', {
        user: context.session.user, name, type, args
    }, context.session.jwt)
    if (!res.error) {
        console.log(res.data)
        return update(update(context, { timedEvents: { [type]: { [res.data._id]: { "$set": res.data } } } }),
            { eventIds2Type: { [res.data._id]: { "$set": type } } }
        )
    } return context
}

async function updateEvent(context, event, updObj) {
    let res = await makeRequest(`events/${event._id}`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, { timedEvents: { [event.type]: { [event._id]: { "$set": res.data } } } })
    } return context
}

async function deleteEvent(context, event) {
    let res = await makeRequest(`events/${event._id}`, 'DELETE', {}, context.session.jwt)
    if (!res.error) {
        return update(context, { timedEvents: { [event.type]: { "$unset": [event._id] } } })
    } return context
}

async function updateEventHistory(context, event, updObj) {
    let res = await makeRequest(`events/${event._id}/history`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, { timedEvents: { [event.type]: { [event._id]: { "$set": res.data } } } })
    } return context
}

export { addEvent, updateEvent, deleteEvent, updateEventHistory }