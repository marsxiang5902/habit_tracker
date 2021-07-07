const httpStatusCodes = require('./httpStatusCodes')
const BaseError = require('./baseError')

module.exports = class Database500Error extends BaseError {
    constructor(
        name,
        statusCode = httpStatusCodes.INTERNAL_SERVER,
        description = 'Database Error.',
        isOperational = true
    ) {
        super(name, statusCode, isOperational, description)
    }
}