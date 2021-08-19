'use strict'

const BaseError = require('./baseError')

const httpStatusErrors = {
    BAD_REQUEST: class badRequestError extends BaseError {
        constructor(
            name = 'Data is invalid.',
            statusCode = 400,
            description = 'Bad Request',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    UNAUTHORIZED: class unauthorizedError extends BaseError {
        constructor(
            name = 'Unauthorized',
            statusCode = 401,
            description = 'Unauthorized',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    NOT_FOUND: class notFoundError extends BaseError {
        constructor(
            name = 'Resource not found',
            statusCode = 404,
            description = 'Not Found',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    CONFLICT: class conflictError extends BaseError {
        constructor(
            name = 'Resource already exists',
            statusCode = 409,
            description = 'Conflict',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    },
    INTERNAL_SERVER: class internalServerError extends BaseError {
        constructor(
            name = 'Internal Error',
            statusCode = 500,
            description = 'Internal Error',
            isOperational = true
        ) {
            super(name, statusCode, isOperational, description)
        }
    }
}
module.exports = httpStatusErrors