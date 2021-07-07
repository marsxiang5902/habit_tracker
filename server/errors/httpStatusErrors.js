const BaseError = require('./baseError')

const httpStatusErrors = {
    BAD_REQUEST: class badRequestError extends BaseError {
        constructor(
            name,
            statusCode = 400,
            description = 'Bad Request.',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    NOT_FOUND: class notFoundError extends BaseError {
        constructor(
            name,
            statusCode = 404,
            description = 'Not found.',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    CONFLICT: class conflictError extends BaseError {
        constructor(
            name,
            statusCode = 409,
            description = 'Conflict.',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    INTERNAL_SERVER: class internalServerError extends BaseError {
        constructor(
            name,
            statusCode = 500,
            description = 'Internal Error.',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    }
}
module.exports = httpStatusErrors