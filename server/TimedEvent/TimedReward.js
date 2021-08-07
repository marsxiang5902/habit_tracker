'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedReward extends TimedEvent {
    constructor(user, name, args) {
        super(user, name, 'reward')
    }
}