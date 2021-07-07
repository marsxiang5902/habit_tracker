"use strict";
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const { do_db_setup, close_db } = require('./database/db_setup')
const interactUser = require('./database/interactUser')
const interactEvent = require('./database/interactEvent')
const { logError, returnError, isOperationalError, logErrorMiddleware } = require('./errors/errorHandler')

do_db_setup()
const app = express()
const port = process.env.PORT || 8080

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

const { userRouter, usersRouter } = require('./routes/users.js')
app.use('/user/', userRouter)
app.use('/users/', usersRouter)

// app.get('/users/add/:user/', async (req, res) => {
//     let result = await interactUser.addUser(req.params.user)
//     res.send(`${result ? "added" : "did not add"} ${req.params.user}`)
// })
// app.get('/users/info/:user/', async (req, res) => {
//     let result = await interactUser.getUserInfo(req.params.user)
//     res.json(result)
// })
// app.get('/users/events/:user/', async (req, res) => {
//     let result = await interactUser.getUserEvents(req.params.user)
//     res.json(result)
// })
// app.get('/events/add/:user/:type/:name/', async (req, res) => {
//     let result = await interactEvent.addEvent(req.params.user, req.params.name, req.params.type)
//     res.send(result)
// })


app.use(logErrorMiddleware)
app.use(returnError)
process.on('unhandledRejection', err => {
    throw err
})
process.on('uncaughtException', err => {
    logError(err)
    if (!isOperationalError) {
        process.exit(1)
    }
})

app.listen(port, () => {
    console.log(`Listening at port ${port}`)
})