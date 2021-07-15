'use strict'

const httpStatusErrors = require('../errors/httpStatusErrors')

const ALL_ROLES = {
    'default': new Set([
        'create:event',
        'read:self_user',
        'read:self_event',
        'update:self_user',
        'update:self_event',
        'delete:self_event',
    ]), 'admin': new Set([
        'create:user',
        'create:event',
        'read:user',
        'read:event',
        'read:self_user',
        'read:self_event',
        'update:user',
        'update:event',
        'update:self_user',
        'update:self_event',
        'update:user_roles',
        'delete:user',
        'delete:event',
        'delete:self_user',
        'delete:self_event'
    ])
}

const ROLES_ORDER = ['default', 'admin']

function checkRoles(roles) {
    if (!Array.isArray(roles)) {
        throw new httpStatusErrors.BAD_REQUEST(`Data invalid.`)
    }
    for (let role in roles) {
        if (!(role instanceof string) || !(role in ALL_ROLES)) {
            throw new httpStatusErrors.BAD_REQUEST(`Data invalid.`)
        }
    }
}

function getPerms(roles) {
    checkRoles(roles)
    let perms = new Set()
    for (let role in roles) {
        perms = new Set([...perms, ...ALL_ROLES[role]])
    }
    return perms;
}

function getHighestRole(roles) {
    checkRoles(roles)
    for (let i = ROLES_ORDER.length; i--;) {
        if (roles.includes(ROLES_ORDER[i])) {
            return ROLES_ORDER[i]
        }
    } return null;
}

function cmpRoles(lhs, rhs) {
    // returns lhs < rhs
    checkRoles([lhs, rhs])
    let lhs_idx = ALL_ROLES.indexOf(lhs), rhs_idx = ALL_ROLES.indexOf(rhs)
    return lhs_idx < rhs_idx
}

module.exports = { ALL_ROLES, ROLES_ORDER, getPerms, getHighestRole, cmpRoles }