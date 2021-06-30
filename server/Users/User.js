const TimedEventSubclasses = require("../TimedEvents/TimedEventSubclasses")

exports.User = class {
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