import React, { useEffect, useState, useContext } from 'react';
import renderTrigger from '../lib/renderTrigger';
import Layout from '../components/layout';
import '../static/page.css'
import { Button } from 'react-bootstrap';
import { appContext } from '../context/appContext';
import { getAllEvents } from '../lib/locateEvents';
import { getDay, getMin } from '../lib/time';
import { updateEventHistory } from '../services/eventServices';
import { eventIsActivated, timeSinceStart } from '../lib/eventIsActivated';

function DashboardContent(props) { // props: dayOfWeek, curMin
    const context = useContext(appContext)

    let generateEvent = () => {
        let curEvent = null, allEvents = getAllEvents(context)
        let dayStartTime = context.session.dayStartTime
        for (let _id in allEvents) {
            let eventRecord = allEvents[_id]
            if (eventIsActivated(eventRecord, props.day, props.min, dayStartTime) &&
                (curEvent === null || timeSinceStart(curEvent.activationTime, dayStartTime) <
                    timeSinceStart(eventRecord.activationTime, dayStartTime))) {
                curEvent = eventRecord
            }
        }
        return curEvent
    }

    let generateTrigger = eventRecord => {
        if (eventRecord === null) {
            return null
        }
        let triggers = eventRecord.triggers
        let ids = Object.keys(triggers)
        if (ids.length > 0) {
            return triggers[ids[Math.floor(Math.random() * ids.length)]]
        } return { name: "Add a trigger to this event!" }
    }

    let event = generateEvent(), trigger = generateTrigger(event)

    return (
        event !== null ? (
            <div className="dashboard">
                <h3>Event: {event.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <Button onClick={async () => {
                    context.setContext(await updateEventHistory(context, event, { "0": true }))
                }}>Next</Button>
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
    let context = useContext(appContext)
    const [min, setMin] = useState(getMin())
    const [day, setDay] = useState(getDay(context.session.dayStartTime))

    useEffect(() => {
        let interval = setInterval(() => {
            setMin(getMin())
            setDay(getDay(context.session.dayStartTime))
        }, 1000 * 10)
        return () => clearInterval(interval)
    }, [])

    return (
        <>
            <Layout name="Home" handleLogout={props.handleLogout} />
            <DashboardContent day={day} min={min} />
        </>
    )
}

export default Dashboard;