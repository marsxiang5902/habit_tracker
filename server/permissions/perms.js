'use strict'

const ALL_PERMS = new Set([
    'create:event',
    'read:user',
    'read:event',
    'read:user_self',
    'read:event_self',
    'update:user',
    'update:event',
    'update:user_self',
    'update:event_self',
    'update:user_roles',
    'delete:user',
    'delete:event',
    'delete:user_self',
    'delete:event_self'
])
module.exports = ALL_PERMS