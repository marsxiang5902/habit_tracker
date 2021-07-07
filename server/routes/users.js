"use strict";
const express = require('express')
const User = require('../Users/User')
const { addUser, getAllUsers, getUser, getUserEvents } = require('../database/interactUser')

let usersRouter = express.Router()

usersRouter.get('/', async (req, res, next) => {
    try {
        let users = await getAllUsers()
        res.json(users)
    } catch (err) { next(err) }
})
usersRouter.get('/:username', async (req, res, next) => {
    try {
        let info = await getUser(req.params.username), events = await getUserEvents(req.params.username)
        let response = {
            info: info,
            events: events
        }
        res.json(response)
    } catch (err) { next(err) }
})
usersRouter.post('/', async (req, res, next) => {
    try {
        await addUser(req.body.user)
        res.status(200).send('Ok')
    } catch (err) { next(err) }
})

module.exports = usersRouter