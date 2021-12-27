'use strict'

const { getDay } = require("../lib/time")

module.exports = class Notification {
    constructor(user, name, type, text) {
        this.user = user
        this.type = type
        this.name = name
        this.text = text
        this.dateCreated = getDay()
    }
}