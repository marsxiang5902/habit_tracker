"use strict";
const express = require('express');
const { login, signup } = require('../services/authServices');

let authRouter = express.Router()

authRouter.post('/login', async (req, res, next) => {
    try {
        res.locals.data = await login(req.body.user, req.body.password)
        next()
    } catch (err) { next(err) }
})
authRouter.post('/signup', async (req, res, next) => {
    try {
        res.locals.data = await signup(req.body.user, req.body.password)
        next()
    } catch (err) { next(err) }
})

module.exports = authRouter