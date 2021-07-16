'use strict'

const httpStatusErrors = require("./httpStatusErrors")

let httpAssert = Object.fromEntries(Object.entries(httpStatusErrors).map((([key, val]) =>
    [key, (condition, name, ...args) => {
        if (!condition) {
            throw new val(name, ...args)
        }
    }]
)))
module.exports = httpAssert