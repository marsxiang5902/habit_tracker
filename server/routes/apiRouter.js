"use strict";
const express = require('express');
const authRouter = require('./authRouter.js')
const usersRouter = require('./usersRouter.js')
const eventsRouter = require('./eventsRouter.js')
const triggersRouter = require('./triggersRouter.js')
const { logError, returnError, isOperationalError, logErrorMiddleware } = require('../errors/errorHandler')
const wrapResponse = require('./wrapResponse')

let apiRouter = express.Router()

apiRouter.use('/', (req, res, next) => { req.resource = {}; next() })
apiRouter.use('/', authRouter)
apiRouter.use('/users/', usersRouter)
apiRouter.use('/events/', eventsRouter)
apiRouter.use('/triggers/', triggersRouter)

apiRouter.use(logErrorMiddleware)
apiRouter.use(returnError)
apiRouter.use(wrapResponse)


module.exports = apiRouter