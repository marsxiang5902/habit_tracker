"use strict";
const express = require('express')
const { do_db_setup, close_db } = require('database/db_setup')

do_db_setup();
const app = express()
const port = process.env.PORT || 8080

const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.query)
})

app.all('/close/', (req, res) => {
    close_db();
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})