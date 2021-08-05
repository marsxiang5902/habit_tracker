import React, { useEffect, useState, useContext } from 'react';
import { renderCueResource } from '../components/cue-list';
import Layout from '../components/layout';
import '../static/page.css'
import { defaultAppContext, appContext } from '../context/appContext';


function DashboardContent(props) {
    let habits = useContext(appContext).timedEvents.habit
    const [trigger, setTrigger] = useState(null)
    const [event, setEvent] = useState(null)

    let generateEvent = () => {
        let uncompleted = []
        habits.forEach(eventRecord => {
            if (!eventRecord.history[0]) {
                uncompleted.append(eventRecord)
            }
        })
        return uncompleted.length > 0 ? uncompleted[Math.floor(Math.random() * uncompleted.length)] :
            null
    }

    let generateTrigger = () => {
        let curEvent = generateEvent()
        if (curEvent === null) {
            return null
        }
        let curTrigger = { name: "Add a trigger to this event!" }
        if (Array.isArray(curEvent.triggers) && curEvent.triggers.length > 0) {
            curTrigger = curEvent.triggers[Math.floor(Math.random() * curEvent.trigger.length)]
        }
        return [curTrigger, curEvent];
    }

    useEffect(() => {
        let [newTrigger, newEvent] = generateTrigger()
        setTrigger(newTrigger)
        setEvent(newEvent)
    }, [JSON.stringify(props)])

    return (
        event !== null ? (
            <div className="dashboard">
                <h3>Habit: {event.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <div className="parent">
                    {renderCueResource(trigger)}
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