'use strict'

const AccessControl = require('accesscontrol')
const ac = new AccessControl()

ac.grant('default')
    .extend('unauthorized')
    .createOwn('event', ['name', 'type', 'args'])
    .readOwn('user', ['user', 'eventLists', 'roles'])
    .readOwn('event', ['name', 'type', 'historyManager'])
    .updateOwn('event', ['name', 'historyManager'])
    .deletOwn('event')

    .grant('admin')
    .extend('default')
    .createAny('event', ['user', 'name', 'type', 'args'])
    .readAny('user', ['_id', 'user', 'eventLists', 'roles'])
    .readAny('event', ['_id', 'user', 'name', 'type', 'historyManager'])
    .updateAny('user', ['user', 'eventLists', 'roles'])
    .updateAny('event', ['name'])

module.exports = ac