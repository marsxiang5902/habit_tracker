'use strict'

const MILLS_IN_MIN = 1000 * 60, MILLS_IN_DAY = MILLS_IN_MIN * 60 * 24
const getDay = function (startTime = 0, offset = 240, date = new Date()) {
    // HARDCODE: USE LOCAL TIMEZONE OFFSET
    return Math.floor((date.getTime() - startTime - offset * MILLS_IN_MIN) / MILLS_IN_DAY)
}

module.exports = {
    MILLS_IN_DAY, MILLS_IN_MIN, getDay
}