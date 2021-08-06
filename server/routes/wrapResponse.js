'use strict'

const { wrapObject } = require("../lib/wrapSliceObject")

const REQUIRED_FIELDS = {
    'data': {},
    'error': "",
    'error_description': ""
}
module.exports = function wrapResponse(req, res) {
    if (res.locals.data === undefined) {
        res.locals.data = {}
    }
    wrapObject(res.locals, REQUIRED_FIELDS)
    res.json(res.locals)
}