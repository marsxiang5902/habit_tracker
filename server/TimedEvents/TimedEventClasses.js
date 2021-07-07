const TimedEvent = require("./TimedEvent")
const TimedHabit = require("./TimedHabit")
const TimedTodo = require("./TimedTodo")
const TimedRepeat = require("./TimedRepeat")

module.exports = {
    superclass: TimedEvent,
    subclasses: {
        habit: TimedHabit,
        todo: TimedTodo,
        repeat: TimedRepeat
    }
}