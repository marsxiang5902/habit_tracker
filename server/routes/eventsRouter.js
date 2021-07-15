"use strict";
const express = require('express')
const { addEvent, getEvent, getEvents, getEventHistory, updateEvent, updateEventHistory, removeEvent } = require('../database/interactEvent')
const { ObjectId } = require('mongodb');


let eventsRouter = express.Router()
eventsRouter.use('/:_id/', (req, res, next) => {
    try {
        req.body._id = ObjectId(req.params._id)
    } catch (err) {
        req.body._id = req.params._id
    } finally {
        next()
    }
})
eventsRouter.post('/', async (req, res, next) => {
    try {
        await addEvent(req.body.user, req.body.name, req.body.type, req.body.args)
        next()
    } catch (err) { next(err) }
})
eventsRouter.get('/:_id', async (req, res, next) => {
    try {
        let data = await getEvent(req.body._id)
        res.locals.data = data
        next()
    } catch (err) { next(err) }
})
eventsRouter.get('/:_id/history', async (req, res, next) => {
    try {
        let data = await getEventHistory(req.body._id, req.body.historyManager)
        res.locals.data = data
        next()
    } catch (err) { next(err) }
})
eventsRouter.put('/:id', async (req, res, next) => { // patch?
    try {
        await updateEvent(req.body._id, req.body.updObj)
        next()
    } catch (err) { next(err) }
})
eventsRouter.put('/:id/history', async (req, res, next) => { // patch?
    try {
        await updateEventHistory(req.body._id, req.body.updObj, req.body.historyManager)
        next()
    } catch (err) { next(err) }
})
eventsRouter.delete('/:id', async (req, res, next) => {
    try {
        await removeEvent(req.body._id)
        next()
    } catch (err) { next(err) }
})

module.exports = eventsRouter