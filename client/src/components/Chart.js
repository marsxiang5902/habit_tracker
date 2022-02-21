import { Line } from 'react-chartjs-2'
import '../static/page.css'
import { Form } from 'react-bootstrap'
import { EventObject } from './EventOnChange'
import { createDatasets, maxLength } from '../lib/chartServices'
import DisplayEvent from './DisplayEvent'
import { getEventById } from '../lib/locateEvents'
import { useContext } from 'react'
import { appContext } from '../context/appContext'

function VariableChange(props){
    if (props.item.value){
        return(
        <div className='variable-select'>
            <select onChange={(e) => props.habitObj.edit.varaible(e, props.index)} style={{"height" : "100%"}}>
                {props.item.type === "habit" ? <>
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
        </div>
        )
    }
    else{
        return <></>
    }

}

function SideBar(props){

    let context = useContext(appContext)
    return(
        <div className='sidebar-container'>
            <div style={{"flexBasis" : "50%"}}>
                <h3>Habits</h3>
                {props.habitObj.value.map((item, index) => {
                    if (item.type === "habit"){
                        return(
                            <div className='event-variable' key={index}>
                                <div style={{"flexBasis" : "60%"}}>
                                    <DisplayEvent all={false} habitObj={props.habitObj} record={getEventById(context, item.id)} index={index} />
                                </div>
                                <div style={{"flexBasis" : "40%", "marginBottom" : "12px"}}>
                                    <VariableChange habitObj={props.habitObj} item={item} index={index} />
                                </div>
                            </div>
                        )
                    }
                })}
            </div>

            <div style={{"flexBasis" : "50%"}}>
                <h3>Form Fields</h3>
                {props.habitObj.value.map((item, index) => {
                    if (item.type === "form"){
                        return (
                            <div className='event-variable' key={index}>
                                <div style={{"flexBasis" : "60%"}}>
                                    <DisplayEvent all={false} habitObj={props.habitObj} record={getEventById(context, item.id)} index={index} name={item.name}/>
                                </div>
                                <div style={{"flexBasis" : "40%", "marginBottom" : "12px"}}>
                                    <VariableChange habitObj={props.habitObj} item={item} index={index} />
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        </div>
    )
}

function LineChart(props){
    let habitObj = EventObject(props.events)
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
        </div>
        <div style={{"marginLeft" : "3%"}}>
            <SideBar habitObj={habitObj}/>
        </div>
    </div>
    )
}

export { LineChart }