"use strict";
const express = require('express')
const User = require('../Users/User')
const { addUser, getAllUsers, getUser, updateUser, removeUser } = require('../database/interactUser')
const { subclasses } = require('../TimedEvents/TimedEventClasses')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { getEvents } = require('../database/interactEvent')
const { ObjectId } = require('mongodb')

let usersRouter = express.Router()

usersRouter.post('/', async (req, res, next) => {
    try {
        await addUser(req.body.user)
        res.send()
    } catch (err) { next(err) }
})
// usersRouter.get('/', async (req, res, next) => { // does not return events for now
//     try {
//         let users = await getAllUsers()
//         res.json(users)
//     } catch (err) { next(err) }
// })
usersRouter.get('/:user', async (req, res, next) => {
    try {
        let data = await getUser(req.params.user)
        let response = {
            data: data
        }
        res.json(response)
    } catch (err) { next(err) }
})
async function getUserEvents(user, eventLists) {
    // if we have to write another function, move to another file
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
usersRouter.get('/:user/events', async (req, res, next) => {
    try {
        let data = await getUserEvents(req.params.user, req.body.eventLists)
        let response = {
            data: data
        }
        res.json(response)
    } catch (err) { next(err) }
})
usersRouter.put('/:user', async (req, res, next) => { // patch?
    try {
        await updateUser(req.params.user, req.body.updObj)
        res.send()
    } catch (err) { next(err) }
})
usersRouter.delete('/:user', async (req, res, next) => {
    try {
        await removeUser(req.params.user)
        res.send()
    } catch (err) { next(err) }
})

module.exports = usersRouter