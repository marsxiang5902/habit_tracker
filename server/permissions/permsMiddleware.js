'use strict'

const httpStatusErrors = require('../errors/httpStatusErrors')
const { jwt_secret, jwt_alg } = require('../config.json')
const ALL_PERMS = require('./perms')
const { ALL_ROLES, ROLES_ORDER, getPerms, getHighestRole, cmpRoles } = require('./roles')
const jwt = require('jsonwebtoken')

function addPermsMiddleware(req, res, next) {
    try {
        let header = req.headers.authorization || req.headers.Authorization
        if (typeof header == 'string') {
            let parts = header.split(' ')
            if (parts.length == 2 && parts[0] == 'Bearer') {
                let token = parts[1]
                let decoded = jwt.verify(token, jwt_secret, { algorithms: [jwt_alg] })
                if ('perms' in decoded) {
                    req.user.perms = decoded.perms
                }
                req.user.user = decoded.user
            }
        }
    } catch (err) { } finally { next() }
}

function permSelf(perm) {
    return `${perm}_self`
}
function checkPermSelf(req, perm) {
    return req.resource && req.resource.user && req.resource.user == req.user.user &&
        req.user.perms.has(permSelf(perm))
}

function authorizeEndpoint(perms) {
    // if user does not have all these perms, error
    return (req, res, next) => {
        addPermsMiddleware(req, res, () => {
            perms.forEach(perm => {
                if (!req.user || !req.user.perms || (!req.user.perms.has(perm) && !checkPermSelf(req, perm))) {
                    next(new httpStatusErrors.UNAUTHORIZED(`Not authorized.`))
                }
            })
            next()
        })
    }
}

module.exports = { authorizeEndpoint }