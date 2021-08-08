import React, { useEffect, useState, useContext } from 'react';
import renderTrigger from '../lib/renderTrigger';
import Layout from '../components/layout';
import '../static/page.css'
import { appContext } from '../context/appContext';
import { getAllEvents } from '../lib/locateEvents';
import { getDay, getMin } from '../lib/time';


function DashboardContent(props) { // props: dayOfWeek, curMin
    const context = useContext(appContext)
    const timedEvents = context.timedEvents
    const [trigger, setTrigger] = useState(null)
    const [event, setEvent] = useState(null)

    useEffect(() => {
        let generateEvent = () => {
            let uncompleted = [], all = getAllEvents(context)
            for (let _id in all) {
                let eventRecord = all[_id]
                if (eventRecord.type !== 'todo' && !eventRecord.history[0] &&
                    eventRecord.activationDays[props.dayOfWeek] && props.curMin >= eventRecord.activationTime
                ) {
                    uncompleted.push(eventRecord)
                }
            }
            uncompleted.sort((r1, r2) => r1.activationTime - r2.activationTime)
            return uncompleted.length > 0 ? uncompleted[0] :
                null
        }

        let generateTrigger = () => {
            let curEvent = generateEvent()
            if (curEvent === null) {
                return [null, null]
            }
            let curTrigger = { name: "Add a trigger to this event!" }
            let triggers = curEvent.triggers
            let ids = Object.keys(triggers)
            if (ids.length > 0) {
                curTrigger = triggers[ids[Math.floor(Math.random() * ids.length)]]
            }
            return [curTrigger, curEvent];
        }

        let [newTrigger, newEvent] = generateTrigger()
        setTrigger(newTrigger)
        setEvent(newEvent)
    }, [JSON.stringify(timedEvents), props.dayOfWeek, props.curMin])

    return (
        event !== null ? (
            <div className="dashboard">
                <h3>Habit: {event.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <div className="parent">
                    {renderTrigger(trigger)}
                </div>
            </div>
        ) : (
            <h1 className="dashboard">Congrats you crushed the day! <a href="https://www.youtube.com/watch?v=tmTZj0emGHw">You deserve this.</a></h1>
        )
    )

}

function Dashboard(props) {
    const [curMin, setCurMin] = useState(getMin())
    const [dayOfWeek, setDayOfWeek] = useState(getDay())

    useEffect(() => {
        let interval = setInterval(() => {
            setCurMin(getMin())
            setDayOfWeek(getDay())
        }, 1000 * 10)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <Layout name="Home" handleLogout={props.handleLogout} />
            <DashboardContent dayOfWeek={dayOfWeek} curMin={curMin} />
        </>
    )
}

export default Dashboard;