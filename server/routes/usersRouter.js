"use strict";
const express = require('express')
const { addUser, getUser, updateUser, removeUser } = require('../database/interactUser')
const getUserEvents = require('../services/getUserEvents')
const { authorizeEndpoint: auth } = require('../permissions/permsMiddleware')

let usersRouter = express.Router()

usersRouter.post('/', async (req, res, next) => {
    try {
        await addUser(req.body.user, req.body.password)
        next()
    } catch (err) { next(err) }
})
usersRouter.get('/:user', auth(['read:self_user']), async (req, res, next) => {
    try {
        let data = await getUser(req.params.user)
        res.locals.data = data
        next()
    } catch (err) { next(err) }
})

usersRouter.get('/:user/events', async (req, res, next) => {
    try {
        let data = await getUserEvents(req.params.user, req.body.eventLists)
        res.locals.data = data
        next()
    } catch (err) { next(err) }
})
usersRouter.put('/:user', async (req, res, next) => { // patch?
    try {
        await updateUser(req.params.user, req.body.updObj)
        next()
    } catch (err) { next(err) }
})
usersRouter.delete('/:user', async (req, res, next) => {
    try {
        await removeUser(req.params.user)
        next()
    } catch (err) { next(err) }
})

module.exports = usersRouter