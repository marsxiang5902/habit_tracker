import { React, useState } from 'react'
import { updateEventHistory } from '../services/eventServices'

function HabitObject(habits, basedOnState = false) {

    let [checked, setChecked] = useState([])
    if (checked.length < Object.keys(habits).length) {
        for (let i in habits) {
            let temp = checked
            if (basedOnState) {
                temp.push({ 'name': habits[i].name, 'value': habits[i].checkedHistory['0'], 'id': habits[i]._id, 'variable': "Daily Completion", 'type': habits[i].type, 'data': habits[i].checkedHistory })
            }
            else if (habits[i].type === "form"){
                for (let field in habits[i].formLayout){
                    let currFormField = habits[i].formLayout[field]
                    if (currFormField[1] === "num"){
                        temp.push({ 'name': currFormField[0], 'value': false, 'id': habits[i]._id, 'variable': "Daily Value", 'type': habits[i].type, 'data': habits[i].formData[currFormField[0]] })
                    }
                }
            }
            else {
                temp.push({ 'name': habits[i].name, 'value': false, 'id': habits[i]._id, 'variable': "Daily Completion", 'type': habits[i].type, 'data': habits[i].checkedHistory })
            }
            setChecked(temp)
        }
    }
    let checkboxChange = async (event, index, context = null, record = null, setContext = null) => {
        let temp = [...checked]
        temp[index].value = event.target.checked
        setChecked(temp)
        if (context !== null) {
            setContext(await updateEventHistory(context, record, { 0: event.target.checked }))
        }
    }

    let variableChange = (event, index) => {
        let temp = [...checked]
        temp[index].variable = event.target.value
        setChecked(temp)
    }


    return { 'value': checked, 'edit': { 'checkbox': checkboxChange, 'varaible': variableChange } }
}

let DisplayHabit = (props) => {
    return (
        <div className="habit-list" key={props.index}>
            <input type="checkbox" className="checkbox"
                checked={props.item.value}
                onChange={(e) => props.all ? props.onChange(e, props.index, props.context, props.record, props.setContext)
                    : props.onChange(e, props.index)}
            />

            <div className="habit">
                <h5 style={{ marginBottom: "0px" }}>{props.record ? props.record.name : props.item.name}</h5>
            </div>
        </div >
    )
}

export { HabitObject, DisplayHabit }