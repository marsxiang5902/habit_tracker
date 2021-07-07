const TimedEvent = require('./TimedEvent')
module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name) {
        super(user, name, 'habit')
    }
}