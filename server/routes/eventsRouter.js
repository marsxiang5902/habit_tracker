"use strict";
const express = require('express')
const { addEvent, getEvent, updateEvent } = require('../database/interactEvent')

let eventsRouter = express.Router()
eventsRouter.get('/:_id', async (req, res, next) => {
    try {
        let info = await getEvent(req.params._id)
        let response = {
            info: info
        }
        res.json(response)
    } catch (err) { next(err) }
})
eventsRouter.post('/', async (req, res, next) => {
    try {
        await addEvent(req.body.user, req.body.name, req.body.type, req.body.args)
        res.status(200).send('Ok')
    } catch (err) { next(err) }
})
eventsRouter.put('/:id', async (req, res, next) => { // patch?
    try {
        await updateEvent(req.params._id, req.body.updObj)
    } catch (err) { next(err) }
})

module.exports = eventsRouter