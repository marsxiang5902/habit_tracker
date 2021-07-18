const { get_users_col, get_events_col } = require('./db_setup')
const { ObjectId } = require('mongodb')

function getUser(user) {
    return get_users_col().findOne({ user: user })
}
function getEvent(_id) {
    return get_events_col().findOne({ _id: _id })
}

module.exports = {
    getUser: getUser, getEvent: getEvent,
    extractEventMiddleware: async function extractEventMiddleware(req, res, next) {
        let _id = req.params._id;
        try {
            _id = ObjectId(_id)
        } catch (err) { } finally {
            try {
                req.resource = [_id, await getEvent(_id)]
            } catch (err2) { } finally { next() }
        }
    },
    extractUserMiddleware: async function extractUserMiddleware(req, res, next) {
        try {
            req.resource = [req.params.user, await getUser(req.params.user)]
        } catch (err) { } finally { next() }
    }
}