"use strict";
const express = require('express')
const { extractUserMiddleware } = require('../database/extractRequestMiddleware')
const { getUser, getUserAuth, getUserEvents, getUserPointsHistory, updateUser,
    updateUserPointsHistory, joinGroup, removeUser } = require('../services/userServices')
const { addPermsMiddleware, authorizeEndpoint } = require('../permissions/permsMiddleware')

let usersRouter = express.Router()
usersRouter.use('/:user/', extractUserMiddleware)

const ENDPOINTS = [
    ['get', '/:user', [['read:user']], getUser],
    ['get', '/:user/events', [['read:user']], getUserEvents],
    ['get', '/:user/points', [['read:user']], getUserPointsHistory],
    ['get', '/:user/auth', [['read:user_auth']], getUserAuth],
    ['put', '/:user', [['update:user']], updateUser],
    ['put', '/:user/points', [['update:user']], updateUserPointsHistory],
    ['put', '/:user/join', [['update:user']], joinGroup],
    ['delete', '/:user', [['delete:user']], removeUser]
]

// example:
// usersRouter.get('/:user', async (req, res, next) => {
//     try {
//         res.locals.data = await getUser(...req.resource)
//         next()
//     } catch (err) { next(err) }
// })
ENDPOINTS.forEach(ops => {
    usersRouter[ops[0]](ops[1], addPermsMiddleware, authorizeEndpoint(...ops[2]), async (req, res, next) => {
        try {
            res.locals.data = await ops[3](req.resource, req.body)
            next()
        } catch (err) { next(err) }
    })
})
module.exports = usersRouter