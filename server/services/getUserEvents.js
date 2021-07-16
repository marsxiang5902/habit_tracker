'use strict'

const { getUser } = require('../database/interactUser')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpAssert = require('../errors/httpAssert')
const { getEvents } = require('../database/interactEvent')
const { ObjectId } = require('mongodb')

module.exports = async function getUserEvents(user, eventLists) {
    if (!eventLists) {
        eventLists = (await getUser(user)).eventLists
    }
    let ret = {}
    for (let type in eventLists) {
        httpAssert.BAD_REQUEST(type in subclasses, `Data is invalid.`)
        try {
            ret[type] = await getEvents(eventLists[type].map(_id => ObjectId(_id)))
        } catch (err) {
            throw new httpStatusErrors.BAD_REQUEST(`Data is invalid.`)
        }
    }
    return ret;
}