'use strict'

const Trigger = require('./Trigger')
const { constructThis } = require('../lib/wrapSliceObject')

const DEFAULT_ARGS = {
    topText: "", bottomText: "", resourceURL: ""
}

module.exports = class TriggerImage extends Trigger {
    constructor(user, name, event_id, args) {
        super(user, name, 'image', event_id)
        constructThis(this, DEFAULT_ARGS, args)
    }
}