"use strict";
const express = require('express')
const { addEvent, getEvent, getEvents, getEventHistory, updateEvent, updateEventHistory } = require('../database/interactEvent')
const { ObjectId } = require('mongodb');


let eventsRouter = express.Router()
eventsRouter.use('/:_id/', (req, res, next) => {
    try {
        req.body._id = ObjectId(req.params._id)
    } catch (err) { }
    finally {
        next()
    }
})
eventsRouter.get('/:_id', async (req, res, next) => {
    try {
        let data = await getEvent(req.body._id)
        let response = {
            data: data
        }
        res.json(response)
    } catch (err) { next(err) }
})
eventsRouter.get('/:_id/history', async (req, res, next) => {
    try {
        let data = await getEventHistory(req.body._id, req.body.historyManager)
        let response = {
            data: data
        }
        res.json(response)
    } catch (err) { next(err) }
})
eventsRouter.post('/', async (req, res, next) => {
    try {
        await addEvent(req.body.user, req.body.name, req.body.type, req.body.args)
        res.send('Ok')
    } catch (err) { next(err) }
})
eventsRouter.put('/:id', async (req, res, next) => { // patch?
    try {
        await updateEvent(req.body._id, req.body.updObj)
        res.send('Ok')
    } catch (err) { next(err) }
})
eventsRouter.put('/:id/history', async (req, res, next) => { // patch?
    try {
        await updateEventHistory(req.body._id, req.body.updObj, req.body.historyManager)
        res.send('Ok')
    } catch (err) { next(err) }
})

module.exports = eventsRouter