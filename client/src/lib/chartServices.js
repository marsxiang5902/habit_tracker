import { EventObject } from "../components/EventList"
import { calcPct, formAvg, formMax, formMin, formSum } from "../lib/dataServices"

function maxLength(habits) {
    let lengths = []
    for (let habit in habits) {
        try{
            lengths.push(Object.keys(habits[habit]['checkedHistory']).length)
        }
        catch(err){
            lengths.push(Object.keys(habits[habit]['data']).length)
        }
    }
    let max = Math.max(...lengths)
    let final = []
    for (let i = 0; i < max; i += 1) {
        final.push(i)
    }
    return final
}

function fillArray(events, event){
    let length = maxLength(events).length
    let temp = {};
        for(let i = 0; i < length; i++){
            if(event.data[i]===undefined){
                temp[i] = NaN
            }
            else{
                temp[i] = event.data[i]
            }
        }
    event.data = temp
    return event
}

function dailyCompletion(events, habit) {
    let completions = []
    let habitArray = Object.values(fillArray(events, habit).data).reverse()
    for (let value in habit.data) {
        if (habitArray[value]) {
            completions.push(10)
        }
        else {
            completions.push(0)
        }
    }
    return completions
}

function dailyPercentage(events, habit) {
    let percentages = []
    let habitArray = Object.values(fillArray(events, habit).data).reverse()
    for (let i = 0; i < Object.keys(habit.data).length; i++) {
        let temp = calcPct(habitArray.slice(0, i))
        percentages.push(temp)
    }
    return percentages
}

function iterator(event, func){
    let ret = []
    let eventArray = Object.values(event.data).reverse()
    for (let i = 0; i < Object.keys(event.data).length; i++) {
        let temp = func(eventArray.slice(0, i))
        ret.push(temp)
    }
    return ret
}

function createDatasets(events, eventsObj) {
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
    for (let i in eventsObj) {
        let currEvent = events[eventsObj[i].id]
        let currEventObj = eventsObj[i]
        let data, type;

        if (currEvent.type === "habit"){
            data = currEventObj.variable === "Daily Completion" ? dailyCompletion(events, currEventObj) : dailyPercentage(events, currEventObj)
            type = currEventObj.variable === "Daily Completion" ? 'bar' : 'line'

        }
        else {
            switch(currEventObj.variable){
                case("Daily Value"):
                    data = Object.values(fillArray(events, currEventObj).data).reverse()
                    type = 'line'
                    break;
                case('Max'):
                    data = iterator(currEventObj, formMax)
                    type = 'line'
                    break;
                case('Min'):
                    data = iterator(currEventObj, formMin)
                    type = 'line'
                    break;
                case('Sum'):
                    data = iterator(currEventObj, formSum)
                    type = 'line'
                    break;
                case('Avg'):
                    data = iterator(currEventObj, formAvg)
                    type = 'line'
                    break;
                default:
                    break;
            }
        }
        if (currEventObj.value) {
            let temp = {
                type: type,
                label: currEventObj.name,
                data: data,
                backgroundColor: backgroundColors[i],
                borderColor: borderColors[i],
                borderWidth: 1
            }
            datasets.push(temp)
        }
    }
    return datasets
}

export { maxLength, createDatasets, fillArray }