"use strict";
const express = require('express')
const { do_db_setup, close_db } = require('./database/db_setup')
const { addUser, getUserInfo } = require('./database/interactUser')

do_db_setup();
const app = express()
const port = process.env.PORT || 8080

let router = express.Router()

router.get('/', (req, res) => {
    console.log(req.query)
})

app.all('/test/', (req, res) => {
    getUserInfo('mars');
    res.send('')
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