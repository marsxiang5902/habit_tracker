'use strict'

const httpStatusErrors = require('../errors/httpStatusErrors')
const { jwt_secret, jwt_alg } = require('../config.json')
const jwt = require('jsonwebtoken')
const assert = require('assert')
const { getPerms } = require('./groupRoles')

function addPermsMiddleware(req, res, next) {
    try {
        let header = req.headers.authorization || req.headers.Authorization
        if (typeof header == 'string') {
            let parts = header.split(' ')
            if (parts.length == 2 && parts[0] == 'Bearer') {
                let token = parts[1]
                let decoded = jwt.verify(token, jwt_secret, { algorithms: [jwt_alg] })
                req.user = { user: decoded.user }
                req.user.perms = new Set(decoded.perms || [])
            }
        }
    } catch (err) { console.log(err) } finally { next() }
}
function addPermsMiddlewareGroup(req, res, next) {
    try {
        if (getGroup(req)) {
            req.user.groupPerms = getPerms(getGroup(req).roles[req.user.user])
        }
    } catch (err) { console.log(err) } finally { next() }
}

function hasSelf(perm) {
    return perm.endsWith('_self')
}
function removeSelf(perm) {
    return hasSelf(perm) ? perm.substring(0, perm.length - 5) : perm
}
function permSelf(perm) {
    return `${perm}_self`
}
function hasGroup(perm) {
    return perm.startsWith('group:')
}
function getGroup(req) {
    return req.resource.groupRecord
}
function removeGroup(perm) {
    return hasGroup(perm) ? perm.substring(6) : perm
}
function defaultGetTargetUser(req) {
    return req.resource.user
}

function authorizeEndpoint(perms, getTargetUser = defaultGetTargetUser) {
    // if user does not have all these perms, error
    // perms should not contain self, getTargetUser checks that
    return (req, res, next) => {
        perms.forEach(perm => {
            try {
                let permsSet = hasGroup(perm) ? req.user.groupPerms : req.user.perms
                perm = removeGroup(perm)
                assert(permsSet.has(perm) ||
                    (getTargetUser(req) === req.user.user && permsSet.has(permSelf(perm))))
            } catch (err) {
                next(new httpStatusErrors.UNAUTHORIZED(`Not authorized.`))
            }
        })
        next()
    }
}

module.exports = { addPermsMiddleware, addPermsMiddlewareGroup, authorizeEndpoint }