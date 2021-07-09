'use strict'

const { subclasses } = require('../TimedEvents/TimedEventClasses')

module.exports = class User {
    constructor(user) {
        this.user = user
        this.eventLists = {}
        for (let type in subclasses) {
            this.eventLists[type] = []
        }
    }
}