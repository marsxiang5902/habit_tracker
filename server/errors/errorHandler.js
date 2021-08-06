'use strict'

const BaseError = require('./baseError')

function logError(err) {
    console.log("Caught error:")
    console.log(err)
}
function logErrorMiddleware(err, req, res, next) {
    logError(err)
    next(err)
}
function returnError(err, req, res, next) {
    if (!(err instanceof BaseError)) {
        err.message = 'Server error.'
        err.description = 'Server error.'
    }
    res.status(err.statusCode || 500)
    res.locals.error = err.message
    res.locals.error_description = err.description
    next()
}
function isOperationalError(err) {
    console.log(err instanceof BaseError ? err.isOperational : true)
    return err instanceof BaseError ? err.isOperational : false
}

module.exports = {
    logError: logError,
    logErrorMiddleware: logErrorMiddleware,
    returnError: returnError,
    isOperationalError: isOperationalError
}