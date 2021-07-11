'use strict'

const BaseError = require('./baseError')

function logError(err) {
    console.log("Caught error:")
    console.log(err)
}
function logErrorMiddleware(err, req, res, next) {
    logError(err)
    next(err, req, res, next)
}
function returnError(err, req, res, next) {
    if (!(err instanceof BaseError)) {
        err.message = 'Server error.'
        err.description = 'Server error.'
    }
    res.status(err.statusCode || 500).json({ error: err.message, description: err.description })
}
function isOperationalError(err) {
    return err instanceof BaseError ? err.isOperational : true
}

module.exports = {
    logError: logError,
    logErrorMiddleware: logErrorMiddleware,
    returnError: returnError,
    isOperationalError: isOperationalError
}