const TimedEvent = require("./TimedEvent")
const TimedHabit = require("./TimedHabit")
const TimedTodo = require("./TimedTodo")

module.exports = {
    super: TimedEvent,
    habit: TimedHabit,
    todo: TimedTodo
}