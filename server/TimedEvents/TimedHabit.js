const TimedEvent = require('./TimedEvent')
module.exports = class TimedHabit extends TimedEvent {
    constructor(id, user, name) {
        super(id, user, name)
        this.type
    }
}