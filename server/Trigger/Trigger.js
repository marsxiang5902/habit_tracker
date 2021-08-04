'use strict'

module.exports = class Trigger {
    constructor(user, name, type, event_id) {
        this.user = user
        this.type = type
        this.name = name
        this.event_id = event_id
    }
}
