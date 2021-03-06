'use strict'

const { ObjectId } = require('mongodb');
const { getEvent } = require('./interactEvent');
const { getGroup } = require('./interactGroup');
const { getTrigger } = require('./interactTrigger');
const { getUser } = require('./interactUser');

async function includeUser(r, user) {
    r.user = user
    try {
        r.userRecord = await getUser(user)
    } finally { return Boolean(r.userRecord) }
}
async function includeEvent(r, _id) {
    try {
        _id = ObjectId(_id)
    } finally {
        r.event_id = _id
        r.eventRecord = await getEvent(_id)
        return Boolean(r.eventRecord)
    }
}
async function includeTrigger(r, _id) {
    try {
        _id = ObjectId(_id)
    } finally {
        r.trigger_id = _id
        r.triggerRecord = await getTrigger(_id)
        return Boolean(r.triggerRecord)
    }
}
async function includeGroup(r, _id) {
    try {
        _id = ObjectId(_id)
    } finally {
        r.group_id = _id
        r.groupRecord = await getGroup(_id)
        return Boolean(r.groupRecord)
    }
}

module.exports = {
    includeUser, includeEvent, includeTrigger, includeGroup,
    extractUserMiddleware: async function extractUserMiddleware(req, res, next) {
        await includeUser(req.resource, req.params.user)
        next()
    },
    extractEventMiddleware: async function extractEventMiddleware(req, res, next) {
        if (await includeEvent(req.resource, req.params._id)) {
            await includeUser(req.resource, req.resource.eventRecord.user)
        } next()
    },
    extractTriggerMiddleware: async function extractTriggerMiddleware(req, res, next) {
        if (await includeTrigger(req.resource, req.params._id)) {
            await includeEvent(req.resource, req.resource.triggerRecord.event_id)
            await includeUser(req.resource, req.resource.triggerRecord.user)
        } next()
    },
    extractGroupMiddleware: async function extractGroupMiddleware(req, res, next) {
        if (await includeGroup(req.resource, req.params._id)) {
            await includeUser(req.resource, req.resource.groupRecord.user)
        } next()
    }
}