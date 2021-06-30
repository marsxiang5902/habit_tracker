const TimedEvent = require('./TimedEvent')
module.exports = class TimedTodo extends TimedEvent {
    constructor(id, user, name) {
        super(id, user, name)
        this.type
    }
}