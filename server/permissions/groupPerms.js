'use strict'

const GROUP_PERMS = new Set([
    'read:group',
    'update:info',
    'update:invite',
    'update:remove',
    'update:remove_self',
    'delete:group'
])
module.exports = GROUP_PERMS