import makeRequest from "../api/makeRequest"
import update from 'immutability-helper'

async function updateUser(context, updObj) {
    let res = await makeRequest(`users/${context.session.user}`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, { session: { "$merge": { ...res.data } } })
    } return context
}

async function updatePoints(context, updObj) {
    let res = await makeRequest(`users/${context.session.user}/points`, 'PUT', updObj, context.session.jwt)
    if (!res.error) {
        return update(context, {session: {pointsHistory: {$set: res.data.pointsHistory}}})
    } return context
}

export { updateUser, updatePoints }