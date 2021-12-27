'use strict'

const { subclasses } = require('../TimedEvent/TimedEventClasses')
const argon2 = require('argon2')
const { getDay } = require('../lib/time')
const HistoryManagerFields = require('../HistoryManager/HistoryManagerFields')

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
        this.partner = null
        this.preferences = {
            dayStartTime: 0,
            theme: "light",
            defaultShowSidebar: true,
            sidebarOrientation: "left"
        }
        this.lastLoginDay = getDay(this.preferences.dayStartTime)
        this.groups = []
        this.pointsHistory = new HistoryManagerFields()
        this.notificationHistory = []
    }
    async init() {
        this.password_hashed = await argon2.hash(this.password)
        delete this.password
    }
}