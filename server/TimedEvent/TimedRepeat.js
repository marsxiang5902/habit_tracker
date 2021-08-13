'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedRepeat extends TimedEvent {
    constructor(user, name, startDay, args) {
        super(user, name, 'repeat', startDay)
    }
}