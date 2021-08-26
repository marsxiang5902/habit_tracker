'use strict'

const { subclasses } = require('../TimedEvent/TimedEventClasses')
const argon2 = require('argon2')
const { getDay } = require('../lib/time')

module.exports = class User {
    constructor(user, password, email) {
        this.user = user
        this.eventLists = {}
        for (let type in subclasses) {
            this.eventLists[type] = []
        }
        this.roles = ['default']
        this.password = password
        this.email = email
        this.dayStartTime = 0
        this.lastLoginDay = getDay(this.dayStartTime)
        this.partner = null
    }
    async init() {
        this.password_hashed = await argon2.hash(this.password)
        delete this.password
    }
}