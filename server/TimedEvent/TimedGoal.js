'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedGoal extends TimedEvent {
    constructor(user, name, startDay, args) {
        super(user, name, 'goal', startDay)
        this.endDay = 1e9
        this.goalTarget = { event_id: '', value: 0, formField: '' }
    }
}