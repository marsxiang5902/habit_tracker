import assert from 'assert'
function wrapObject(obj, wrap) {
    assert(typeof obj == 'object' && typeof wrap == 'object')
    for (let field in wrap) {
        obj[field] = (field in obj) ? obj[field] : wrap[field];
    }
}
function sliceObject(obj, subset) {
    assert(typeof obj == 'object' && (Array.isArray(subset) ||
        (typeof subset === 'object' && subset !== null)))
    let ret = {};
    (Array.isArray(subset) ? subset : Object.keys(subset)).forEach(field => {
        if (field in obj) {
            ret[field] = obj[field]
        }
    })
    return ret;
}
export { wrapObject, sliceObject }