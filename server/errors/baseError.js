'use strict'

module.exports = class BaseError extends Error {
    constructor(name, statusCode, isOperational, description) {
        super(name)
        Object.setPrototypeOf(this, new.target.prototype)
        this.statusCode = statusCode
        this.isOperational = isOperational
        this.description = description
        Error.captureStackTrace(this)
    }
}