import { formAvg, formMax, formMin, formSum, pct, streaks, totalDayCompletion } from "../lib/dataServices"
import { Table } from "react-bootstrap"
import { getNumFormFields, getSomeEvents } from "../lib/locateEvents"

//streaks are messed up, constantly changing

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

    let habitTable = 
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

    let fields = getNumFormFields(props.context)
    let fieldNames = Object.keys(getNumFormFields(props.context))
    console.log(fields)

    let formTable = 
    <Table striped bordered hover variant="dark">
        <thead>
        <tr>
            <th>Field</th>
            <th>Max</th>
            <th>Min</th>
            <th>Sum</th>
            <th>Average</th>
        </tr>
        </thead>
        <tbody>
        {Object.values(fields).map((item, index) => {
            return(
            <tr>
                <td>{fieldNames[index]}</td>
                <td>{`${formMax(Object.values(item))}`}</td>
                <td>{`${formMin(Object.values(item))}`}</td>
                <td>{`${formSum(Object.values(item))}`}</td>
                <td>{`${formAvg(Object.values(item))}`}</td>
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
                {formTable}
                {habitTable}
            </div>
        </>
    )
}

export default DisplayOverview