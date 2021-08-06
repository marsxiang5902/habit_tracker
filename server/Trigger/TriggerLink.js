'use strict'

const Trigger = require('./Trigger')
const { constructThis } = require('../lib/wrapSliceObject')

const DEFAULT_ARGS = {
    resourceURL: ""
}

module.exports = class TriggerLink extends Trigger {
    constructor(user, name, event_id, args) {
        super(user, name, 'link', event_id)
        constructThis(this, DEFAULT_ARGS, args)
    }
}