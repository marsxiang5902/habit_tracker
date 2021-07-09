const TimedEvent = require('./TimedEvent')
const { getDay, completionLogBitmask } = require('./completionLogBitmask')
module.exports = class TimedHabit extends TimedEvent {
    constructor(user, name, args) {
        super(user, name, 'habit')
        if ('date' in arg) {
            this.completionLogBitmask = completionLogBitmask(args.lastDate, args.dateBitmask)
        } else {
            this.completionLogBitmask = completionLogBitmask(new Date(), 0)
        }
    }
}