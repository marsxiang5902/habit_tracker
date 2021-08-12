'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedReward extends TimedEvent {
    constructor(user, name, startDay, args) {
        super(user, name, startDay, 'reward')
    }
}