import { Line } from 'react-chartjs-2'
import '../static/page.css'
import { Form } from 'react-bootstrap'
import { DisplayHabit, HabitObject } from './HabitList'
import { createDatasets, maxLength } from '../lib/chartServices'
import DisplayEvent from './DisplayEvent'

function SideBar(props){

    return(
        <div style={{marginBottom: "30px"}}>
        <h3>Habits</h3>
        {props.habitObj.value.map((item, index) => {
            if (item.type === "habit"){
                // return <DisplayHabit all={false} onChange={props.habitObj.edit.checkbox} record={item} item={item} index={index}/>
                return <DisplayEvent all={false} habitObj={props.habitObj} record={item} index={index} />
            }
        })}
        <h3>Form Fields</h3>
        {props.habitObj.value.map((item, index) => {
            if (item.type === "form"){
                return <DisplayEvent all={false} habitObj={props.habitObj} record={item} index={index} />
            }
        })}
        <h3>Varaibles</h3>
        {props.habitObj.value.map((item, index) => {
            if (item.value){
                return(
                <>
                    <p style={{'marginBottom': '2px', 'marginTop': '10px'}}>{item.name}</p>
                    <select onChange={(e) => props.habitObj.edit.varaible(e, index)}>
                        {item.type === "habit" ? <>
                        <option value="Completion Percentage">Completion Percentage</option>
                        <option selected value="Daily Completion">Daily Completion</option>
                        </> : <>
                        <option value="Daily Value">Daily Value</option>
                        <option value="Max">Max</option>
                        <option value="Min">Min</option>
                        <option value="Sum">Sum</option>
                        <option value="Avg">Average</option>

                        </>}
                    </select>
                </>
                )
            }
        })}
        </div>
    )
}

function LineChart(props){
    let habitObj = HabitObject(props.events)
    return(
    <div className="wrapper">
        <div className="data-grid" style={{marginTop: "20px", marginBottom: "20px"}}>
            <div className="data-chart">
                <Line
                    data={{
                        labels: maxLength(props.events),
                        datasets: createDatasets(props.events, habitObj.value)
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
            <SideBar habitObj={habitObj}/>
        </div>
    </div>
    )
}

export { LineChart }