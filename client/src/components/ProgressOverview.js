import { pct, streaks, totalDayCompletion } from "../services/dataServices"
import { Table } from "react-bootstrap"

function DisplayOverview(props){

    let strk = streaks(props.context.timedEvents.habit)
    let percentages = pct(props.context.timedEvents.habit)
    let totalCompletion = totalDayCompletion(props.context.timedEvents.habit)

    let dataWidget = (title, value, name) => {
        return(
            <>
            <h6>{title}</h6>
            <h2>{typeof value == 'number' ? `${value} Days`: value}</h2>
            <p>{value == 0 ? "Habit: None": `Habit: ${name}`}</p>
            </>
        )
    }

    let table = 
    <Table striped bordered hover variant="dark">
        <thead>
        <tr>
            <th>Habit</th>
            <th>Max Streak</th>
            <th>Current Streak</th>
            <th>Percentage</th>
            <th>Total Checked</th>
        </tr>
        </thead>
        <tbody>
        {strk.all.map((item, index) => {
            return(
            <tr>
                <td>{item.name}</td>
                <td>{`${item.maxValue} Days`}</td>
                <td>{`${item.currValue} Days`}</td>
                <td>{`${percentages.all[index].value}%`}</td>
                <td>{`${totalCompletion[index].value} Days`}</td>
            </tr>)
        })}
        </tbody>
    </Table>

    return(
        <>
            <div className="data-grid">
                <div className="initial-data data-container">
                    {dataWidget("Longest Streak", strk.max.value, strk.max.name)}
                </div>
                <div className="data-container">
                    {dataWidget("Longest Current Streak", strk.curr.value, strk.curr.name)}
                </div>
                <div className="final-data data-container">
                    {dataWidget("Highest Percentage", `${percentages.max.value}%`, percentages.max.name)}
                </div>
            </div>
            <div className="data-table">
                {table}
            </div>
        </>
    )
}

export default DisplayOverview