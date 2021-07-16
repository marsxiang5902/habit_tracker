"use strict";
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const jwt = require('express-jwt')
const { do_db_setup, close_db } = require('./database/db_setup')
const usersRouter = require('./routes/usersRouter.js')
const eventsRouter = require('./routes/authRouter.js')
const authRouter = require('./routes/authRouter.js')
const { logError, returnError, isOperationalError, logErrorMiddleware } = require('./errors/errorHandler')
const wrapResponse = require('./routes/wrapResponse')


do_db_setup()
const app = express()
const port = process.env.PORT || 8080

app.use(helmet())
app.use(express.json())
app.use(cors())
app.use(morgan('combined'))

app.use('/', authRouter)
app.use('/users/', usersRouter)
app.use('/events/', eventsRouter)

app.use(logErrorMiddleware)
app.use(returnError)
app.use(wrapResponse)

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