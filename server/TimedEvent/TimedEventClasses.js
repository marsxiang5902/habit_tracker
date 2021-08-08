'use strict'

const TimedEvent = require("./TimedEvent")
const TimedHabit = require("./TimedHabit")
const TimedTodo = require("./TimedTodo")
const TimedRepeat = require("./TimedRepeat")
const TimedReward = require("./TimedReward")
const TimedStack = require("./TimedStack")

module.exports = {
    superclass: TimedEvent,
    subclasses: {
        habit: TimedHabit,
        todo: TimedTodo,
        repeat: TimedRepeat,
        reward: TimedReward,
        stack: TimedStack
    }
}