'use strict'

const TimedEvent = require('./TimedEvent')
const httpAssert = require('../errors/httpAssert')

const DEFAULT_ARGS = {
    resourceURL: ""
}

module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, args) {
        httpAssert.BAD_REQUEST(typeof args == 'object')
        for (let key in DEFAULT_ARGS) {
            if (!(key in args)) {
                args[key] = DEFAULT_ARGS[key]
            }
        }
        super(user, name, 'cue')
        httpAssert.BAD_REQUEST(typeof args.resourceURL == 'string', `Resource URL is invalid.`)
        this.resourceURL = args.resourceURL
    }
}