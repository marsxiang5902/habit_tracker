const { subclasses } = require("../TimedEvents/TimedEventClasses")
const eventList = require("../EventLists/eventList")

module.exports = class user {
    constructor(user) {
        this.user = user
    }
}