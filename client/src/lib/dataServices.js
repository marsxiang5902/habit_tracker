//assuming the habit starts on day 0
function updatedHabitHistory(habits){
    let updActivationDays = []
    let updObj = []
    for(let habit in habits){
        habit = habits[habit]
        for(let i = 0, day = 0; i < Object.keys(habit.history).length; i++, day++){
            if(day == 7){
                day = 0
            }
            if(habit.activationDays[day]){
                updActivationDays.push(habit.history[i])
            }
        }
        updObj.push({'id': habit._id, 'name': habit.name,"activationDays" : updActivationDays})
        updActivationDays = []
    }
    return updObj
}

function checkMax(streak, name, obj){
    if (streak > obj.value){
        obj.value = streak
        obj.name = name
    }
    return obj
}

function streaks(habits){
    habits = updatedHabitHistory(habits)
    let currStreak = {'value': 0, 'name': ''}
    let maxStreak = {'value': 0, 'name': ''}
    let all = []
    for (let habit in habits){
        habit = habits[habit]
        let keepChecking = true
        let streak = 0
        let currAll = {'currValue': 0, 'maxValue': 0,'name': habit.name}
        for(let i = Object.keys(habit.activationDays).length; i >= 0; i--){
            if(habit.activationDays[i]){
                streak += 1
            }
            else{
                checkMax(streak, habit.name, maxStreak)
                let temp = checkMax(streak, habit.name, {'value': currAll.maxValue, 'name': currAll.name})
                currAll.maxValue = temp.value
                if (keepChecking){
                    checkMax(streak, habit.name, currStreak)
                    checkMax(streak, habit.name, {'value': currAll.currValue, 'name': currAll.name})
                    currAll.currValue = temp.value
                }  
                streak = 0
                keepChecking = false
            }
        }
        checkMax(streak, habit.name, maxStreak)
        let temp = checkMax(streak, habit.name, {'value': currAll.maxValue, 'name': currAll.name})
        currAll.maxValue = temp.value
        if (keepChecking){
            checkMax(streak, habit.name, currStreak)
            checkMax(streak, habit.name, {'value': currAll.currValue, 'name': currAll.name})
            currAll.currValue = temp.value
        }  
        all.push(currAll)
    }
    return {'curr': currStreak, 'max': maxStreak, 'all': all}
    
}

function calcPct(items) {
    try {
      let percent = 0;
      for (let key in items) {
        if (items[key]) ++percent;
      }
      return Math.floor(100 * percent / Object.keys(items).length)
    } catch (err) { console.log(err); return 0; }
}

function pct(habits){
    let max = {'value': 0, 'name': ''}
    let all = []
    for(let habit in habits){
        habit = habits[habit]
        //what to do about habit history
        let currPct = calcPct(habit.history)
        max = checkMax(currPct, habit.name, max)
        all.push({'value': currPct, 'name': habit.name})
    }
    return {'max': max, 'all': all}
}

function totalDayCompletion(habits){
    let obj = []
    for(let habit in habits){
        let count = 0
        habit = habits[habit]
        for(let i = 0; i < Object.keys(habit.history).length; i++){
            if (habit.history[i]) count+=1
        }
        obj.push({'name': habit.name, 'value': count})
    }
    return obj
}



export {streaks, pct, calcPct, totalDayCompletion}