"use strict";
const express = require('express')
const httpStatusErrors = require('../errors/httpStatusErrors')
const { login } = require('../auth/login')

let authRouter = express.Router()

authRouter.post('/login', async (req, res, next) => {
    try {
        let data = await login(req.body.user, req.body.password)
        res.locals.data = data
        next()
    } catch (err) { next(err) }
})

module.exports = authRouter