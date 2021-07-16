"use strict";
const express = require('express')
const httpAssert = require('../errors/httpAssert')
const { login } = require('../auth/login')
const { addUser } = require('../database/interactUser')


let authRouter = express.Router()

authRouter.post('/signup', async (req, res, next) => {
    // and login
    try {
        await addUser(req.body.user, req.body.password)
        let data = await login(req.body.user, req.body.password)
        res.locals.data = { jwt: data }
        next()
    } catch (err) { next(err) }
})
authRouter.post('/login', async (req, res, next) => {
    try {
        let data = await login(req.body.user, req.body.password)
        res.locals.data = { jwt: data }
        next()
    } catch (err) { next(err) }
})
authRouter.post('/logout', async (req, res, next) => {
    try {
        next()
    } catch (err) { next(err) }
})

module.exports = authRouter