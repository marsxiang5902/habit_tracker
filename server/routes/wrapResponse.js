'use strict'

const REQUIRED_FIELDS = {
    'data': {},
    'error': "",
    'error_description': ""
}
module.exports = function wrapResponse(req, res) {
    let ret = {}
    for (let field in REQUIRED_FIELDS) {
        ret[field] = (field in res.locals) ? res.locals[field] : REQUIRED_FIELDS[field];
    }
    res.json(ret)
}