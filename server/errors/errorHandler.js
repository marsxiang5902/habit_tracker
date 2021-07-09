'use strict'

function logError(err) {
    console.log("Caught error:")
    console.log(err)
}
function logErrorMiddleware(err, req, res, next) {
    logError(err)
    next(err, req, res, next)
}
function returnError(err, req, res, next) {
    res.status(err.statusCode || 500).send(err.message)
}
function isOperationalError(err) {
    return err instanceof BaseError ? err.isOperational : false
}

module.exports = {
    logError: logError,
    logErrorMiddleware: logErrorMiddleware,
    returnError: returnError,
    isOperationalError: isOperationalError
}