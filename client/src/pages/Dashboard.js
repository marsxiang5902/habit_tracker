import React, { useEffect, useState, useContext } from 'react';
import renderTrigger from '../lib/renderTrigger';
import Layout from '../components/layout';
import '../static/page.css'
import * as Icons from "react-icons/fa";
import { Button } from 'react-bootstrap';
import { appContext } from '../context/appContext';
import { getAllEvents, getEventById } from '../lib/locateEvents';
import { getDay, getMin } from '../lib/time';
import { updateEvent, updateEventHistory } from '../services/eventServices';
import { eventIsActivated, timeSinceStart } from '../lib/eventIsActivated';

function DashboardContent(props) { // props: dayOfWeek, curMin
    const [triggerCaches, setTriggerCaches] = useState({})
    const context = useContext(appContext)

    let generateEvent = () => {
        let curEvent = null, allEvents = getAllEvents(context)
        let dayStartTime = context.session.dayStartTime
        for (let _id in allEvents) {
            let eventRecord = allEvents[_id]
            if (eventIsActivated(eventRecord, props.day, props.min, dayStartTime) &&
                (curEvent === null || timeSinceStart(curEvent.activationTime, dayStartTime) <
                    timeSinceStart(eventRecord.activationTime, dayStartTime))) {
                if (eventRecord.type !== 'stack' || eventRecord.eventList.length > 0) {
                    curEvent = eventRecord
                }
            }
        }
        return curEvent
    }

    let generateTrigger = eventRecord => {
        if (eventRecord === null) {
            return null
        }
        let _id = eventRecord._id, triggers = eventRecord.triggers
        if (!(_id in triggerCaches) || !(triggerCaches[_id]._id in triggers)) {
            let trigger_ids = Object.keys(triggers), len = trigger_ids.length
            if (len > 0) {
                setTriggerCaches({
                    ...triggerCaches, [_id]:
                        triggers[trigger_ids[Math.floor(Math.random() * len)]]
                })
            }
        }
        return triggerCaches[_id] || { name: "Add a trigger to this event!" }
    }

    let event = generateEvent()

    if (event !== null) {
        if (event.type === 'stack') {
            let stackedEvent = getEventById(context, event.eventList[event.pointer])
            let trigger = generateTrigger(stackedEvent)
            return <div className="dashboard">
                <div className="pushed">
                    <h5>
                        <Icons.FaArrowLeft className="hover" onClick={async () => {
                            context.setContext(await updateEvent(context, event, { pointer: 0 }))
                        }} />
                    </h5>
                    <h4 className="pushed-spaced">Stack: {event.name}</h4>
                </div>
                <h3>Event: {stackedEvent.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <Button onClick={async () => {
                    if (event.pointer === event.eventList.length - 1) {
                        context.setContext(await updateEventHistory(context, event, { "0": true }))
                    } else {
                        context.setContext(await updateEvent(context, event, { pointer: event.pointer + 1 }))
                    }
                    context.setContext(await updateEventHistory(context.getContext(), stackedEvent, { "0": true }))
                }}>Next</Button>
                <div className="parent">
                    {renderTrigger(trigger)}
                </div>
            </div>
        } else {
            let trigger = generateTrigger(event)
            return <div className="dashboard">
                <h3>Event: {event.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <Button onClick={async () => {
                    context.setContext(await updateEventHistory(context, event, { "0": true }))
                }}>Next</Button>
                <div className="parent">
                    {renderTrigger(trigger)}
                </div>
            </div>
        }
    } else {
        return <h1 className="dashboard">Congrats you crushed the day! <a href="https://www.youtube.com/watch?v=tmTZj0emGHw">You deserve this.</a></h1>
    }
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
        <div className="wrapper">
            <Layout name="Home" handleLogout={props.handleLogout} />
            <DashboardContent day={day} min={min} />
        </div>
    )
}

export default Dashboard;