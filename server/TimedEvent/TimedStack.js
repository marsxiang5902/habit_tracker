'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedStack extends TimedEvent {
    constructor(user, name, args) {
        super(user, name, 'stack')
        this.eventList = []
    }
}