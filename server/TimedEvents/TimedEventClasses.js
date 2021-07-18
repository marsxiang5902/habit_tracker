'use strict'

const TimedEvent = require("./TimedEvent")
const TimedHabit = require("./TimedHabit")
const TimedTodo = require("./TimedTodo")
const TimedRepeat = require("./TimedRepeat")
const TimedCue = require('./TimedCue')

module.exports = {
    superclass: TimedEvent,
    subclasses: {
        habit: TimedHabit,
        todo: TimedTodo,
        repeat: TimedRepeat,
        cue: TimedCue
    }
}