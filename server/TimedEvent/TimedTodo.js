'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedTodo extends TimedEvent {
    constructor(user, name, startDay, args) {
        super(user, name, startDay, 'todo')
    }
}