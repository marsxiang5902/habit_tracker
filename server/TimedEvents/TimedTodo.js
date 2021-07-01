const TimedEvent = require('./TimedEvent')
module.exports = class TimedTodo extends TimedEvent {
    constructor(user, name) {
        super(user, name)
    }
}