import { ProgressBar } from "react-bootstrap";
import { eventActiveToday } from "../lib/eventIsActivated";
import { getAllEvents, getSomeEvents } from "../lib/locateEvents";


function dailyProgress(context){
    let daily_events = Object.values(getSomeEvents(context, ['todo', 'habit', 'form']));
    for (let i = 0; i < daily_events.length; i++) {
        if (daily_events[i].type !== 'todo'){
            if (!eventActiveToday(daily_events[i])){
                daily_events.splice(i, 1)
            }
        }
        
    }
    
    let completed = 0
    for (const event in daily_events) {
        if (event.checkedHistory !== undefined && event.checkedHistory['0']){
            completed++;
        }
    }
    return completed / daily_events.length;
}

function DisplayProgress(props){
    console.log(dailyProgress(props.context));
    let now = 30
    return(
        <>
            <ProgressBar now={now}/>
            <span style={{'fontWeight': 'bold'}}>{now}%</span>
        </>
    )
}

export default DisplayProgress;