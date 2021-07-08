const TimedEvent = require('./TimedEvent')
module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, args) {
        super(user, name, 'habit')
    }
}