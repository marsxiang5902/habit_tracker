'use strict'

const httpStatusErrors = require("./httpStatusErrors")

let httpAssert = Object.fromEntries(Object.entries(httpStatusErrors).map((([key, val]) =>
    [key, (condition, name) => {
        if (!condition) {
            if (name) {
                throw new val(name)
            } else {
                throw new val()
            }
        }
    }]
)))
module.exports = httpAssert