"use strict";
const express = require('express');
const httpStatusErrors = require('../errors/httpStatusErrors');
const { addPermsMiddleware } = require('../permissions/permsMiddleware');
const { login, signup } = require('../services/authServices');
const { universal_password } = require('../config.json')

let authRouter = express.Router()

authRouter.post('/newDay', addPermsMiddleware, async (req, res, next) => {
    try {
        if (!req.user) {
            next(new httpStatusErrors.UNAUTHORIZED(`Not authorized.`))
        }
        res.locals.data = await login(req.user.user, universal_password)
        next()
    } catch (err) { next(err) }
})
authRouter.post('/login', async (req, res, next) => {
    try {
        res.locals.data = await login(req.body.user, req.body.password)
        next()
    } catch (err) { next(err) }
})
authRouter.post('/signup', async (req, res, next) => {
    try {
        res.locals.data = await signup(req.body.user, req.body.password, req.body.email)
        next()
    } catch (err) { next(err) }
})

module.exports = authRouter