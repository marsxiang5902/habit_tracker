const TimedEvent = require('./TimedEvent')
module.exports = class TimedRepeat extends TimedEvent {
    constructor(user, name) {
        super(user, name, 'repeat')
    }
}