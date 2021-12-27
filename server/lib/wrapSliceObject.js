const assert = require('assert');
const httpAssert = require('../errors/httpAssert');

function wrapObject(obj, wrap, checkType = false) {
    assert(typeof obj == 'object' && typeof wrap == 'object')
    if (checkType) {
        for (let field in wrap) {
            httpAssert.BAD_REQUEST(!(field in obj) || typeof obj[field] == typeof wrap[field])
        }
    }
    for (let field in wrap) {
        obj[field] = (field in obj) ? obj[field] : wrap[field];
    }
}
function sliceObject(obj, subset) {
    assert(typeof obj == 'object' && (Array.isArray(subset) ||
        (typeof yourVariable === 'object' && yourVariable !== null)))
    let ret = {};
    (Array.isArray(subset) ? subset : Object.keys(subset)).forEach(field => {
        if (field in obj) {
            ret[field] = obj[field]
        }
    })
    return ret;
}
function constructThis(obj, DEFAULT_ARGS, args) {
    assert(typeof obj == 'object' && typeof DEFAULT_ARGS == 'object')
    httpAssert.BAD_REQUEST(typeof args == 'object', 'Data is invalid.')
    wrapObject(args, DEFAULT_ARGS, true)
    wrapObject(obj, args)
}

module.exports = { wrapObject, sliceObject, constructThis }