"use strict";
const express = require('express')
const { extractTriggerMiddleware } = require('../database/extractRequestMiddleware')
const { addTrigger, getTrigger, updateTrigger, removeTrigger } = require('../services/triggerServices')
const { addPermsMiddleware, authorizeEndpoint } = require('../permissions/permsMiddleware')

let triggersRouter = express.Router()
triggersRouter.use('/:_id', extractTriggerMiddleware)

const ENDPOINTS = [
    ['post', '/', [['update:event'], req => req.body.user], addTrigger],
    ['get', '/:_id', [['read:event']], getTrigger],
    ['put', '/:_id', [['update:event']], updateTrigger],
    ['delete', '/:_id', [['update:event']], removeTrigger]
]

ENDPOINTS.forEach(ops => {
    triggersRouter[ops[0]](ops[1], addPermsMiddleware, authorizeEndpoint(...ops[2]), async (req, res, next) => {
        try {
            res.locals.data = await ops[3](req.resource, req.body)
            next()
        } catch (err) { next(err) }
    })
})
module.exports = triggersRouter