const { getUser } = require('../database/interactUser')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { getEvents } = require('../database/interactEvent')
const { ObjectId } = require('mongodb')

module.exports = async function getUserEvents(user, eventLists) {
    if (!eventLists) {
        eventLists = (await getUser(user)).eventLists
    }
    let ret = {}
    for (let type in eventLists) {
        if (!(type in subclasses)) {
            throw new httpStatusErrors.BAD_REQUEST(`Data is not valid.`)
        }
        try {
            ret[type] = await getEvents(eventLists[type].map(_id => ObjectId(_id)))
        } catch (err) {
            throw new httpStatusErrors.BAD_REQUEST(`Data is not valid.`)
        }
    }
    return ret;
}