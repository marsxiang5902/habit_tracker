"use strict";
const express = require('express')
const { do_db_setup, close_db } = require('./database/db_setup')
const interactUser = require('./database/interactUser')
const interactEvent = require('./database/interactEvent')
const InteractEventList = require('./database/interactEventList')

do_db_setup();
const app = express()
const port = process.env.PORT || 8080

app.get('/users/add/:user/', async (req, res) => {
    let result = await interactUser.addUser(req.params.user)
    res.send(`${result ? "added" : "did not add"} ${req.params.user}`)
})
app.get('/users/info/:user/', async (req, res) => {
    let result = await interactUser.getUserInfo(req.params.user)
    res.json(result)
})
app.get('/users/events/:user/', async (req, res) => {
    let result = await interactUser.getUserEvents(req.params.user)
    res.json(result)
})
app.get('/events/add/:user/:name/:type/', async (req, res) => {
    let result = await interactEvent.addEvent(req.params.user, req.params.name, req.params.type)
    res.send(result)
})


// admin?
app.all('/setup/', (req, res) => {
    do_db_setup();
    res.send('')
})
app.all('/close/', (req, res) => {
    close_db();
    res.send('')
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})