'use strict'

const ALL_PERMS = new Set([
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
module.exports = ALL_PERMS