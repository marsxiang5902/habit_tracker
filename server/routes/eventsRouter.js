"use strict";
const express = require('express')
const { extractEventMiddleware } = require('../database/extractRequestMiddleware')
const { addEvent, getEvent, getEventHistory, getEventFormHistory, updateEvent, updateEventHistory,
    updateEventFormLayout, updateEventFormHistory, removeEvent, assertFormMiddleware } = require('../services/eventServices')
const { authorizeEndpoint: auth } = require('../permissions/permsMiddleware')

let eventsRouter = express.Router()
eventsRouter.use('/:_id/', extractEventMiddleware)
eventsRouter.use('/:_id/form/', assertFormMiddleware)

const ENDPOINTS = [
    ['post', '/', [['create:event'], req => req.body.user], addEvent],
    ['get', '/:_id', [['read:event']], getEvent],
    ['get', '/:_id/history', [['read:event']], getEventHistory],
    ['get', '/:_id/form', [['read:event']], getEventFormHistory],
    ['put', '/:_id', [['update:event']], updateEvent],
    ['put', '/:_id/history', [['update:event']], updateEventHistory],
    ['put', '/:_id/form', [['update:event']], updateEventFormHistory],
    ['put', '/:_id/form/layout', [['update:event']], updateEventFormLayout],
    ['delete', '/:_id', [['delete:event']], removeEvent]
]

ENDPOINTS.forEach(ops => {
    eventsRouter[ops[0]](ops[1], auth(...ops[2]), async (req, res, next) => {
        try {
            res.locals.data = await ops[3](req.resource, req.body)
            next()
        } catch (err) { next(err) }
    })
})
module.exports = eventsRouter