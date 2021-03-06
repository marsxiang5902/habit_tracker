function updatedHabitHistory(habits) {
    let updHistory = []
    let updObj = []
    let d = new Date()
    for (let habit in habits) {
        habit = habits[habit]
        d.setDate(d.getDate() - Object.keys(habit.checkedHistory).length)
        for (let i = 0, day = d.getDay(); i < Object.keys(habit.checkedHistory).length; i++, day++) {
            if (day == 7) {
                day = 0
            }
            if (habit.activationDays[day]) {
                updHistory.push(habit.checkedHistory[i])
            }
        }
        updObj.push({ 'id': habit._id, 'name': habit.name, "checkedHistory": updHistory })
        updHistory = []
    }
    return updObj
}

function checkMax(streak, name, obj) {
    if (streak > obj.value) {
        obj.value = streak
        obj.name = name
    }
    return obj
}

function streaks(habits) {
    habits = updatedHabitHistory(habits)
    let currStreak = { 'value': 0, 'name': '' }
    let maxStreak = { 'value': 0, 'name': '' }
    let all = []
    for (let habit in habits) {
        habit = habits[habit]
        let keepChecking = true
        let streak = 0
        let currAll = { 'currValue': 0, 'maxValue': 0, 'name': habit.name }
        let buffer = 0
        if (!habit.checkedHistory[0]) {
            buffer = 1
        }
        for (let i = buffer; i <= Object.keys(habit.checkedHistory).length; i++) {
            if (habit.checkedHistory[i]) {
                streak += 1
            }
            else {
                checkMax(streak, habit.name, maxStreak)
                let temp = checkMax(streak, habit.name, { 'value': currAll.maxValue, 'name': currAll.name })
                currAll.maxValue = temp.value
                if (keepChecking) {
                    checkMax(streak, habit.name, currStreak)
                    checkMax(streak, habit.name, { 'value': currAll.currValue, 'name': currAll.name })
                    currAll.currValue = temp.value
                }
                streak = 0
                keepChecking = false
            }
        }
        checkMax(streak, habit.name, maxStreak)
        let temp = checkMax(streak, habit.name, { 'value': currAll.maxValue, 'name': currAll.name })
        currAll.maxValue = temp.value
        if (keepChecking) {
            checkMax(streak, habit.name, currStreak)
            checkMax(streak, habit.name, { 'value': currAll.currValue, 'name': currAll.name })
            currAll.currValue = temp.value
        }
        all.push(currAll)
    }
    return { 'curr': currStreak, 'max': maxStreak, 'all': all }

}

//avg
function calcPct(items) {
    items = items.filter(val => !isNaN(val))
    try {
        let percent = 0;
        for (let key in items) {
            if (items[key]) ++percent;
        }
        return Math.floor(100 * percent / Object.keys(items).length)
    } catch (err) { return 0; }
}

function pct(habits) {
    let max = { 'value': 0, 'name': '' }
    let all = []
    for (let habit in habits) {
        habit = habits[habit]
        let currPct = calcPct(Object.values(habit['checkedHistory']))
        max = checkMax(currPct, habit.name, max)
        all.push({ 'value': currPct, 'name': habit.name })
    }
    return { 'max': max, 'all': all }
}

function totalDayCompletion(habits) {
    let obj = []
    for (let habit in habits) {
        let count = 0
        habit = habits[habit]
        for (let i = 0; i < Object.keys(habit.checkedHistory).length; i++) {
            if (habit.checkedHistory[i]) count += 1
        }
        obj.push({ 'name': habit.name, 'value': count })
    }
    return obj
}

//max
function formMax(form) {
    let max = 0;
    let currMax = 0;
    for (let i = 0; i < form.length; i++) {
        currMax = form[i]
        max = checkMax(currMax, 'none', { 'value': max, 'name': null }).value
    }
    return max
}
//min
function formMin(form) {
    let min = 0;
    let currMin = 0;
    for (let i = 0; i < form.length; i++) {
        currMin = -(form[i])
        min = -(checkMax(currMin, 'none', { 'value': -min, 'name': null }).value)
    }
    return min
}

//sum
function formSum(form) {
    let sum = 0;
    for (let i = 0; i < form.length; i++) {
        if (!isNaN(form[i])) sum += form[i]
    }
    return sum
}
//avg
function formAvg(form) {
    let scale = 1;
    form = form.filter(x => !isNaN(x))
    // if (formMax(form) <= 10){ 
    //     scale = 1
    // }
    let ret = (scale * (formSum(form) / form.length)).toFixed(1)
    return isNaN(ret) ? 0 : ret
}


export { streaks, pct, calcPct, totalDayCompletion, formMax, formMin, formSum, formAvg }