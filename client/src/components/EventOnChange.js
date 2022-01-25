import { React, useState } from 'react'
import noCheckedHistory from '../lib/noCheckedHistory'
import { updateEventHistory } from '../services/eventServices'

function EventObject(events, basedOnState = false, numOnly = true) {
    //using an array and index for checkBox change only work since we load all instances of a single event
    let [checked, setChecked] = useState([])
    if (checked.length < Object.keys(events).length) {
        for (let i in events) {
            let temp = checked
            if (basedOnState) {
                temp.push({ 'name': events[i].name, 'value': events[i].checkedHistory['0'], 'id': events[i]._id, 'variable': "Daily Completion", 'type': events[i].type, 'data': events[i].checkedHistory })
            }
            else if (events[i].type === "form") {
                for (let field in events[i].formLayout) {
                    let currFormField = events[i].formLayout[field]
                    if (currFormField[1] === "num") {
                        temp.push({ 'name': currFormField[0], 'value': false, 'id': events[i]._id, 'variable': "Daily Value", 'type': events[i].type, 'data': events[i].formData[currFormField[0]] })
                    }
                    else if (!numOnly) {
                        temp.push({ 'name': currFormField[0], 'value': false, 'id': events[i]._id, 'variable': "Daily Value", 'type': events[i].type, 'data': events[i].formData[currFormField[0]] })

                    }
                }
            }
            else {
                temp.push({ 'name': events[i].name, 'value': false, 'id': events[i]._id, 'variable': "Daily Completion", 'type': events[i].type, 'data': events[i].checkedHistory })
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


// habit + checkbox
let DisplayEventTextCheck = (props) => {
    return (
        <div className="habit-list" key={props.index}>

            {!noCheckedHistory.has(props.record.type) && !props.noCheck &&
                <input type="checkbox"
                    checked={props.all ? props.record.checkedHistory['0'] : props.value}
                    onChange={(e) => props.all ? props.onChange(e, props.index, props.context, props.record, props.setContext)
                        : props.onChange(e, props.index)}
                />
            }

            <div className="habit">
                {/* for getting the name of a form field vs the name of an event */}
                <p style={{ marginBottom: "0px", 'fontSize': 'large' }}>{props.name === undefined ? props.record.name : props.name}</p>
            </div>
        </div >
    )
}

export { EventObject, DisplayEventTextCheck }