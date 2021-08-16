import { Line } from 'react-chartjs-2'
import '../static/page.css'
import { Form } from 'react-bootstrap'
import { DisplayHabit, HabitObject } from './HabitList'
import { createDatasets, maxLength } from '../lib/chartServices'

function SideBar(props){
    return(
        <div>
        <h3>Viewable Habits</h3>
        <DisplayHabit checked={props.habitObj.value} onChange={props.habitObj.edit.checkbox}/>
        <h3>Habit Varaibles</h3>
        {props.habitObj.value.map((item, index) => {
            if (item.value){
                return(
                <>
                    <p style={{'marginBottom': '2px', 'marginTop': '10px'}}>{item.name}</p>
                    <select onChange={(e) => props.habitObj.edit.varaible(e, index)}>
                        <option selected value="Daily Completion">Daily Completion</option>
                        <option value="Completion Percentage">Completion Percentage</option>
                    </select>
                </>
                )
            }
        })}
        </div>
    )
}

function LineChart(props){
    let habitObj = HabitObject(props.habits)

    return(
    <div className="wrapper">
        <div className="data-grid">
            <div className="data-chart">
                <Line
                    data={{
                        labels: maxLength(props.habits),
                        datasets: createDatasets(props.habits, habitObj.value)
                    }}
                    height={40}
                    width={80}
                    options={{
                        scales: {
                          x: {
                            title: {
                              color: 'black',
                              display: true,
                              text: 'Days'
                            }
                          }
                        }
                    }}
                >
                </Line>
            </div>
            <SideBar habits={props.habits} habitObj={habitObj}/>
        </div>
    </div>
    )
}

export { LineChart }