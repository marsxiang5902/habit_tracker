const TimedEventSubclasses = require("../TimedEvents/TimedEventSubclasses")

module.exports = class user {
    constructor(name) {
        this.name = name
        this.timedEvents = {}
        for (let property in TimedEventSubclasses) {
            if (property != 'super') {
                this.timedEvents[property] = []
            }
        }
    }
}