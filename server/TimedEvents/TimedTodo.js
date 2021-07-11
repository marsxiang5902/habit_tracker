'use strict'

const TimedEvent = require('./TimedEvent')
module.exports = class TimedTodo extends TimedEvent {
    constructor(user, name, args) {
        super(user, name, 'todo')
    }
}