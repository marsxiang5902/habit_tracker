'use strict'

// make it so that certain fields / goals can be shared
module.exports = class Group {
    constructor(user, name) {
        this.user = user
        this.name = name
        this.members = {
            [user]: []
        }
        this.roles = {
            [user]: ['default', 'admin']
        }
        this.invites = []
    }
}