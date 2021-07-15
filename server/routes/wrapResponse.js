const REQUIRED_FIELDS = ['data', 'error', 'error_description']
module.exports = function wrapResponse(req, res) {
    let ret = {}
    REQUIRED_FIELDS.forEach((field) => {
        ret[field] = (field in res.locals) ? res.locals[field] : {};
        console.log(field)
        console.log(field in res.locals)
    })
    res.json(ret)
}