'use strict'

const ALL_PERMS = new Set([
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
module.exports = ALL_PERMS