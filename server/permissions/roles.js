'use strict'

const httpAssert = require('../errors/httpAssert')

const ALL_ROLES = {
    // group_self is not used since those permissions fall under groups instead of all
    'default': new Set([
        'create:event_self',
        'create:group_self',
        'read:user_self',
        'read:event_self',
        'read:group',
        'update:user_self',
        'update:event_self',
        'update:group',
        'delete:event_self',
        'delete:group_self',
    ]), 'admin': new Set([
        'create:event',
        'create:group',
        'read:user',
        'read:user_auth',
        'read:event',
        'read:group',
        'read:user_self',
        'read:user_auth_self',
        'read:event_self',
        'read:group_self',
        'update:user',
        'update:group',
        'update:event',
        'update:user_self',
        'update:event_self',
        'update:group_self',
        'update:user_roles',
        'delete:user',
        'delete:event',
        'delete:group',
        'delete:user_self',
        'delete:event_self',
        'delete:group_self'
    ])
}

const ROLES_ORDER = ['default', 'admin']

function checkRoles(roles) {
    httpAssert.BAD_REQUEST(Array.isArray(roles), `Data is invalid.`)
    roles.forEach(role => {
        httpAssert.BAD_REQUEST(typeof role == 'string' && role in ALL_ROLES, `Data is invalid.`)
    })
}
function getPerms(roles) {
    checkRoles(roles)
    let perms = new Set()
    roles.forEach(role => {
        perms = new Set([...perms, ...(ALL_ROLES[role])])
    })
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