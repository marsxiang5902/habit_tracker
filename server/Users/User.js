'use strict'

const { subclasses } = require('../TimedEvent/TimedEventClasses')
const argon2 = require('argon2')
const { getDay } = require('../lib/time')

module.exports = class User {
    constructor(user, password) {
        this.user = user
        this.eventLists = {}
        for (let type in subclasses) {
            this.eventLists[type] = []
        }
        this.roles = ['default']
        this.password = password
        this.lastLoginDay = getDay()
    }
    async init() {
        this.password_hashed = await argon2.hash(this.password)
        delete this.password
    }
}