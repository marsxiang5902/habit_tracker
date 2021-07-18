"use strict";
const express = require('express')
const { extractUserMiddleware } = require('../database/extractRequestMiddleware')
const { getUser, getUserAuth, getUserEvents, removeUser } = require('../services/userServices')
const { authorizeEndpoint: auth } = require('../permissions/permsMiddleware')

let usersRouter = express.Router()
usersRouter.use('/:user', extractUserMiddleware)

const ENDPOINTS = [
    ['get', '/:user', [['read:user']], getUser],
    ['get', '/:user/events', [['read:user']], getUserEvents],
    ['get', '/:user/auth', [['read:user_auth']], getUserAuth],
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
    usersRouter[ops[0]](ops[1], auth(...ops[2]), async (req, res, next) => {
        try {
            res.locals.data = await ops[3](...(req.resource || []), req.body)
            next()
        } catch (err) { next(err) }
    })
})
module.exports = usersRouter