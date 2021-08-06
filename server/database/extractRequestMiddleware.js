const { ObjectId } = require('mongodb');
const { getEvent } = require('./interactEvent');
const { getTrigger } = require('./interactTrigger');
const { getUser } = require('./interactUser');

module.exports = {
    extractUserMiddleware: async function extractUserMiddleware(req, res, next) {
        try {
            req.resource = [req.params.user, await getUser(req.params.user)]
        } catch (err) { } finally { next() }
    },
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
    extractTriggerMiddleware: async function extractTriggerMiddleware(req, res, next) {
        let _id = req.params._id;
        try {
            _id = ObjectId(_id)
        } catch (err) { } finally {
            try {
                req.resource = [_id, await getTrigger(_id)]
            } catch (err2) { } finally { next() }
        }
    }
}