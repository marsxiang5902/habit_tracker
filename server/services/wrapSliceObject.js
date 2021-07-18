const assert = require('assert')

function wrapObject(obj, wrap) {
    assert(typeof obj == 'object' && typeof wrap == 'object')
    for (let field in wrap) {
        obj[field] = (field in obj) ? obj[field] : wrap[field];
    }
}
function sliceObject(obj, subset) {
    assert(typeof obj == 'object' && Array.isArray(subset))
    let ret = {}
    subset.forEach(field => {
        if (field in obj) {
            ret[field] = obj[field]
        }
    })
    return ret;
}

module.exports = { wrapObject: wrapObject, sliceObject: sliceObject }