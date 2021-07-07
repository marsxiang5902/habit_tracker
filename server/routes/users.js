"use strict";
const express = require('express')
const { addUser, getAllUsers, getUser, getUserEvents } = require('../database/interactUser')

let userRouter = express.Router()
userRouter.get('/:username', async (req, res, next) => {
    try {
        let info = await getUser(req.params.username), events = await getUserEvents(req.params.username)
        let response = {
            info: info,
            events: events
        }
        res.json(response)
    } catch (err) {
        next(err)
    }
})

let usersRouter = express.Router()
usersRouter.get('/', async (req, res, next) => {
    try {
        let users = await getAllUsers()
        res.json(users)
    } catch (err) {
        next(err)
    }
})

module.exports = {
    userRouter: userRouter,
    usersRouter: usersRouter
}