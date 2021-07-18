"use strict";
const express = require('express')
const { extractEventMiddleware } = require('../database/extractRequestMiddleware')
const { addEvent, getEvent, getEventHistory, updateEvent,
    updateEventHistory, removeEvent } = require('../services/eventServices')
const { authorizeEndpoint: auth } = require('../permissions/permsMiddleware')


let eventsRouter = express.Router()
eventsRouter.use('/:_id', extractEventMiddleware)

const ENDPOINTS = [
    ['post', '/', [['create:event'], req => req.body.user], addEvent],
    ['get', '/:_id', [['read:event']], getEvent],
    ['get', '/:_id/history', [['read:event']], getEventHistory],
    ['put', '/:_id', [['update:event']], updateEvent],
    ['put', '/:_id/history', [['update:event']], updateEventHistory],
    ['delete', '/:_id', [['delete:event']], removeEvent]
]

ENDPOINTS.forEach(ops => {
    eventsRouter[ops[0]](ops[1], auth(...ops[2]), async (req, res, next) => {
        try {
            res.locals.data = await ops[3](...(req.resource || []), req.body)
            next()
        } catch (err) { next(err) }
    })
})
module.exports = eventsRouter