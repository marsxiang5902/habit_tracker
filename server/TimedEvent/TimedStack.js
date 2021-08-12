'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedStack extends TimedEvent {
    constructor(user, name, startDay, args) {
        super(user, name, startDay, 'stack')
        this.eventList = []
    }
}