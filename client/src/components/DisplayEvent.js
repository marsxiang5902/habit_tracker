import { DisplayHabit } from "./HabitList";

function DisplayEvent(props){
    return (
        <div className="card-2 border-2" key={props.index}>
            <div className="habit habit-2 inline" style={{"alignItems": 'baseline'}}>
                {props.all ?
                <DisplayHabit onChange={props.habitObj.edit.checkbox}
                  item={props.habitObj.value[props.index]} index={props.index} context={props.context} record={props.record}
                  setContext={props.setContext} all={true} /> : 
                <DisplayHabit all={false} onChange={props.habitObj.edit.checkbox} record={props.item} item={props.item} index={props.index}/>
                }

                {props.children}
              {/* {props.type === 'habit' && <h4 className="habit no-padding-top">{pct(record.history)}%</h4>} */}
            </div>
            <div className="event-color">
            </div>
          </div>
    )
}

export default DisplayEvent