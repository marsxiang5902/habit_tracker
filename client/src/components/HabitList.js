import { React, useState } from 'react'

function HabitObject(habits){

    let [checked, setChecked] = useState([])


    if (checked.length < Object.keys(habits).length){
        for (let i in habits){
            let temp = checked
            temp.push({'name': habits[i].name, 'value': false})
            setChecked(temp)
        }
    }

    let onChange = (event, index) => {
        let temp = [...checked]
        temp[index].value = event.target.checked
        setChecked(temp)
    }


    return {'value': checked, 'edit': onChange}
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