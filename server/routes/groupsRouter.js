"use strict";
const express = require('express')
const { extractGroupMiddleware } = require('../database/extractRequestMiddleware')
const { addGroup, getGroup, getGroupData, updateGroup, inviteToGroup, removeFromGroup,
    shareEvent, removeGroup, } = require('../services/groupServices')
const { addPermsMiddleware, addPermsMiddlewareGroup, authorizeEndpoint } = require('../permissions/permsMiddleware')

let groupsRouter = express.Router()
groupsRouter.use('/:_id', extractGroupMiddleware)

const ENDPOINTS = [
    ['post', '/', [['update:group'], req => req.body.user], addGroup],
    ['get', '/:_id', [['read:group', 'group:read:group']], getGroup],
    ['get', '/:_id/data', [['read:group', 'group:read:group']], getGroupData],
    ['put', '/:_id', [['update:group', 'group:update:info']], updateGroup],
    ['put', '/:_id/invite', [['update:group', 'group:update:invite']], inviteToGroup],
    ['put', '/:_id/remove', [['update:group', 'group:update:remove_self']], removeFromGroup],
    ['put', '/:_id/share', [['update:group']], shareEvent],
    ['delete', '/:_id', [['delete:group', 'group:delete:group']], removeGroup]
]

ENDPOINTS.forEach(ops => {
    groupsRouter[ops[0]](ops[1], addPermsMiddleware, addPermsMiddlewareGroup,
        authorizeEndpoint(...ops[2]), async (req, res, next) => {
            try {
                res.locals.data = await ops[3](req.resource, req.body)
                next()
            } catch (err) { next(err) }
        })
})
module.exports = groupsRouter