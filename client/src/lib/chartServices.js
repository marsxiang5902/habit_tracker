import { HabitObject } from "../components/HabitList"
import { calcPct } from "../lib/dataServices"

function maxLength(habits){
    let lengths = []
    for(let habit in habits){
        lengths.push(Object.keys(habits[habit].history).length)
    }
    let max = Math.max(...lengths)
    let final = []
    for (let i=0; i <= max; i+= 1){
        final.push(i)
    }
    return final
}

function dailyCompletion(habit){
    let completions = []
    for (let value in habit.history){
        if(habit.history[value]){
            completions.push(100)
        }
        else{
            completions.push(0)
        }
    }
    return completions
}

function dailyPercentage(habit){
    let percentages = []
    let habitArray = Object.values(habit.history)
    for (let i = 0; i < Object.keys(habit.history).length; i++){
        let temp = calcPct(habitArray.slice(0, i))
        percentages.push(temp)
    }
    return percentages
}

function createDatasets(habits, habitObj){
    let backgroundColors = [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)'
    ]
    let borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
    ]
    let datasets = []
    let i=0
    for (let habit in habits){
        let currHabit = habits[habit]
        let currHabitObj = habitObj[i]
        if(currHabitObj.value){
            let temp = {
                type: currHabitObj.variable === "Daily Completion" ? 'bar': 'line',
                label: currHabit.name,
                data: currHabitObj.variable === "Daily Completion" ? dailyCompletion(currHabit): dailyPercentage(currHabit),
                backgroundColor: backgroundColors[i],
                borderColor: borderColors[i],
                borderWidth: 1
            }
            datasets.push(temp)
        }
        i++;
    }
    console.log(datasets)
    return datasets
}

export {maxLength, createDatasets}