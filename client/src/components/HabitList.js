import { React, useState } from 'react'

function HabitObject(habits){

    console.log(habits.length)
    let checked = []

    if (checked.length < Object.keys(habits).length){
        for (let i in habits){
            checked[i] = {'name': habits[i].name, 'value': false}
        }
    }

    let onChange = (event, index) => {
        checked[index].value = event.target.checked
    }

    return {'value': checked, 'edit': onChange}
}

let DisplayHabit = (props) => {

    console.log(props.checked)

    return(
        (props.checked).map((item, index) => {
            return <div className="habit-list" key={index}>
                <input type="checkbox" className="checkbox"
                    checked={item.value}
                    onChange={(e) => props.onChange(e, index)}
                >
                </input>
    
                <div className="habit">
                    <h5 style={{ marginBottom: "0px" }}>{item.name}</h5>
                </div>
            </div>
        })
        )

}

export { HabitObject, DisplayHabit }