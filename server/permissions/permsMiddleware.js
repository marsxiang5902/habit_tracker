'use strict'

const httpStatusErrors = require('../errors/httpStatusErrors')
const { jwt_secret, jwt_alg } = require('../config.json')
const jwt = require('jsonwebtoken')
const assert = require('assert')

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
    } catch (err) { } finally { next() }
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
function defaultGetTargetUser(req) {
    return req.resource.user
}
function authorizeEndpoint(perms, getTargetUser = defaultGetTargetUser) {
    // if user does not have all these perms, error
    // perms should not contain self, getTargetUser checks that
    return (req, res, next) => {
        addPermsMiddleware(req, res, () => {
            perms.forEach(perm => {
                try {
                    assert(req.user.perms.has(perm) ||
                        (getTargetUser(req) === req.user.user && req.user.perms.has(permSelf(perm))))
                } catch (err) {
                    console.log(err)
                    next(new httpStatusErrors.UNAUTHORIZED(`Not authorized.`))
                }
            })
            next()
        })
    }
}

module.exports = { authorizeEndpoint }