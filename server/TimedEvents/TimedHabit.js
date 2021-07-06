const TimedEvent = require('./TimedEvent')
module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, type) {
        super(user, name, type)
    }
}