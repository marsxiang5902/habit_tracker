'use strict'

const httpAssert = require('../errors/httpAssert')

const GROUP_ROLES = {
    'default': new Set([
        'read:group',
        'update:remove_self',
    ]), 'admin': new Set([
        'read:group',
        'update:info',
        'update:invite',
        'update:remove',
        'update:remove_self',
        'delete:group'
    ])
}

const GROUP_ROLES_ORDER = ['default', 'admin']

function checkRoles(roles) {
    httpAssert.BAD_REQUEST(Array.isArray(roles), `Data is invalid.`)
    roles.forEach(role => {
        httpAssert.BAD_REQUEST(typeof role == 'string' && role in GROUP_ROLES, `Data is invalid.`)
    })
}
function getPerms(roles) {
    // console.log(roles)
    checkRoles(roles)
    let perms = new Set()
    roles.forEach(role => {
        perms = new Set([...perms, ...(GROUP_ROLES[role])])
    })
    return perms;
}
function getHighestRole(roles) {
    checkRoles(roles)
    for (let i = GROUP_ROLES_ORDER.length; i--;) {
        if (roles.includes(GROUP_ROLES_ORDER[i])) {
            return GROUP_ROLES_ORDER[i]
        }
    } return null;
}
function cmpRoles(lhs, rhs) {
    // returns lhs < rhs
    checkRoles([lhs, rhs])
    let lhs_idx = GROUP_ROLES.indexOf(lhs), rhs_idx = GROUP_ROLES.indexOf(rhs)
    return lhs_idx < rhs_idx
}


module.exports = { GROUP_ROLES, GROUP_ROLES_ORDER, getPerms, getHighestRole, cmpRoles }