'use strict'

const { updateUser: db_updateUser, getUser: db_getUser } = require("../database/interactUser")
const assert = require("assert")

module.exports = async function sendNotification(notif) {
    assert(notif)
    let user = notif.user, userRecord = await db_getUser(user)
    await db_updateUser(user, userRecord, { notificationHistory: userRecord.notificationHistory.concat(notif) })
}