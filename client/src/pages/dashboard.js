import React, { useEffect, useState, useContext } from 'react';
import renderTrigger from '../lib/renderTrigger';
import Layout from '../components/layout';
import '../static/page.css'
import { appContext } from '../context/appContext';


function DashboardContent(props) {
    const context = useContext(appContext)
    const habits = context.timedEvents.habit
    const [trigger, setTrigger] = useState(null)
    const [event, setEvent] = useState(null)

    useEffect(() => {
        let generateEvent = () => {
            let uncompleted = []
            for (let _id in habits) {
                let eventRecord = habits[_id]
                if (!eventRecord.history[0]) {
                    uncompleted.push(eventRecord)
                }
            }
            return uncompleted.length > 0 ? uncompleted[Math.floor(Math.random() * uncompleted.length)] :
                null
        }

        let generateTrigger = () => {
            let curEvent = generateEvent()
            if (curEvent === null) {
                return [null, null]
            }
            let curTrigger = { name: "Add a trigger to this event!" }
            let triggers = curEvent.triggers
            if (triggers) {
                let ids = Object.keys(triggers)
                curTrigger = triggers[ids[Math.floor(Math.random() * ids.length)]]
            }
            return [curTrigger, curEvent];
        }

        let [newTrigger, newEvent] = generateTrigger()
        setTrigger(newTrigger)
        setEvent(newEvent)
    }, [habits])

    return (
        event && trigger ? (
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
    return (
        <>
            <Layout name="Home" handleLogout={props.handleLogout} />
            <DashboardContent />
        </>
    )
}

export default Dashboard;