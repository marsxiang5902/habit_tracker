'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedGoal extends TimedEvent {
    constructor(user, name, startDay, args) {
        super(user, name, 'goal', startDay)
    }
}