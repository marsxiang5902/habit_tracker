import { React, useState } from 'react'

function HabitObject(habits){

    let [checked, setChecked] = useState([])


    if (checked.length < Object.keys(habits).length){
        for (let i in habits){
            let temp = checked
            temp.push({'name': habits[i].name, 'value': false, 'id': habits[i]._id, 'variable': "Daily Completion"})
            setChecked(temp)
        }
    }

    let checkboxChange = (event, index) => {
        let temp = [...checked]
        temp[index].value = event.target.checked
        setChecked(temp)
    }

    let variableChange = (event, index) => {
        console.log(event)
        let temp = [...checked]
        temp[index].variable = event.target.value
        setChecked(temp)
    }


    return {'value': checked, 'edit': {'checkbox': checkboxChange, 'varaible': variableChange}}
}

let DisplayHabit = (props) => {

    return(
        props.checked.map((item, index) => {
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