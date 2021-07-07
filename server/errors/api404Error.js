const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

module.exports = class Api404Error extends BaseError {
    constructor(
        name,
        statusCode = httpStatusCodes.NOT_FOUND,
        description = 'Not found.',
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}