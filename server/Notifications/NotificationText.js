'use strict'

const Notification = require('./Notification')
const httpAssert = require('../errors/httpAssert')
const { wrapObject } = require('../lib/wrapSliceObject')

const DEFAULT_ARGS = {}

module.exports = class NotificationText extends Notification {
    constructor(user, name, text, args = {}) {
        httpAssert.BAD_REQUEST(typeof args == 'object', `Data is invalid.`)
        wrapObject(args, DEFAULT_ARGS, true)
        super(user, name, 'text', text)
    }
}