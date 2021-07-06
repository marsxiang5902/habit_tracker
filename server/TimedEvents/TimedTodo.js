const TimedEvent = require('./TimedEvent')
module.exports = class TimedTodo extends TimedEvent {
    constructor(user, name, type) {
        super(user, name, type)
    }
}