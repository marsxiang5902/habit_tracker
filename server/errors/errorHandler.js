function logError(err) {
    console.log(err)
}
function logErrorMiddleware(err, req, res, next) {
    logError(err)
    next(err)
}
function returnError(err, req, res, next) {
    res.status(err.statusCode || 500).send(err.message)
}
function isOperationalError(err) {
    return error instanceof BaseError ? error.isOperational : false
}

module.exports = {
    logError: logError,
    logErrorMiddleware: logErrorMiddleware,
    returnError: returnError,
    isOperationalError: isOperationalError
}