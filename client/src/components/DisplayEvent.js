import { OverlayTrigger, Popover, Tooltip } from "react-bootstrap";
import { updateEvent } from "../services/eventServices";
import { DisplayHabit } from "./HabitList";

function DisplayEvent(props){
    let colors = ["#F9F871", "#00896F", "#D23927", "#FF9671", "#FF6F91", "#2C73D2"]
    let changeColor = async(idx) => {
        props.setContext( await updateEvent(props.context, props.record, {'color' : idx}))
    }
    return (
        <>
            <div className="card-2 border-2" key={props.index}>
                <div className="habit habit-2 inline">
                    {props.all ?
                    <DisplayHabit onChange={props.habitObj.edit.checkbox} index={props.index} context={props.context} record={props.record}
                    setContext={props.setContext} all={true} /> : 
                    <DisplayHabit all={false} onChange={props.habitObj.edit.checkbox} record={props.record} index={props.index}/>
                    }

                    {props.children}
                {/* {props.type === 'habit' && <h4 className="habit no-padding-top">{pct(record.history)}%</h4>} */}
                </div>
                {props.all ? 
                <OverlayTrigger
                    placement="bottom"
                    trigger="click"
                    rootClose
                    overlay={
                        <div className="card-2 border-2" style={{"width": "15%", "height":"15%", "backgroundColor": "white", "marginTop": '5px', 'alignItems': 'center'}}>
                            <div className="color-picker">
                                {colors.map((item, idx) => {
                                        return (
                                            <div style={{"width": "25%", "height":"30%", "backgroundColor": item, 'margin': '2px', 'borderRadius': '5px'}} onClick={() => {changeColor(idx)}}></div>
                                        )
                                })}
                            </div>
                        </div>
                    }
                    >
                    <div className="event-color" style={{"backgroundColor": colors[props.record.color]}}></div>
                </OverlayTrigger> : 
                    <div className="event-color" style={{"backgroundColor": colors[props.record.color]}}></div>
                }
            </div>
        </>
    )
}

export default DisplayEvent;