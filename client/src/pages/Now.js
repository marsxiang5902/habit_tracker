import React, { useEffect, useState, useContext } from 'react';
import renderTrigger from '../lib/renderTrigger';
import Layout from '../components/layout';
import '../static/page.css'
import * as Icons from "react-icons/fa";
import { Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import { appContext } from '../context/appContext';
import { getAllEvents, getEventById, getSomeEvents } from '../lib/locateEvents';
import { getDay, getMin, sortGoals } from '../lib/time';
import { updateEvent, updateEventHistory } from '../services/eventServices';
import { eventIsActivated, timeSinceStart } from '../lib/eventIsActivated';
import { updateEventFormHistory } from "../services/eventServices";
import useGAEvent from '../analytics/useGAEvent';
import DisplayProgress from '../components/ProgressBars';
import DisplayEvent from '../components/DisplayEvent';
import { EventObject } from '../components/EventOnChange';

const convertTypes = {
    num: Number,
    str: x => x
}

// generate current event and get all events
let generateEvent = (context, day, min) => {
    let allEvents = getAllEvents(context)
    let dayStartTime = context.session.preferences.dayStartTime
    let events = []
    for (let _id in allEvents) {
        let eventRecord = allEvents[_id]
        if (eventIsActivated(eventRecord, day, min, dayStartTime)) {
            if (eventRecord.type !== 'stack' || eventRecord.pointer < eventRecord.eventList.length) {
                // if ((curEvent === null || timeSinceStart(curEvent.activationTime, dayStartTime) <
                //     timeSinceStart(eventRecord.activationTime, dayStartTime))) {
                //     curEvent = eventRecord
                // }
                events.push(eventRecord)
            }
        }
    }
    events.sort((r1, r2) => timeSinceStart(r2.activationTime, dayStartTime) - timeSinceStart(r1.activationTime, dayStartTime))
    return { 'curr': events.length > 0 ? events[0] : null, events }
}

function ModalBody(props) {
    let record = props.record, layout = record.formLayout
    const context = useContext(appContext)
    const [formResponse, setFormResponse] = useState(layout.map(
        formField => record.formData[formField[0]][0]))
    const TYPES = { 'num': 'number', 'str': 'textarea' }
    return <Form onSubmit={async e => {
        e.preventDefault()
        let updObj = {}
        layout.forEach((formField, idx) => {
            updObj[formField[0]] = { 0: formResponse[idx] }
        })
        context.setContext(await updateEventFormHistory(context, record, updObj))
        props.hide()
    }}>
        {layout.map((formField, idx) => (
            <Form.Group key={formField[0]}>
                <Form.Label>{formField[0]}</Form.Label>
                {(TYPES[formField[1]] === 'textarea') ?
                    <Form.Control as="textarea" value={formResponse[idx]} onChange={e => {
                        let newFormResponse = [...formResponse]
                        newFormResponse[idx] = convertTypes[formField[1]](e.target.value)
                        setFormResponse(newFormResponse)
                    }} /> : <Form.Control type="number" value={formResponse[idx]} onChange={e => {
                        let newFormResponse = [...formResponse]
                        newFormResponse[idx] = convertTypes[formField[1]](e.target.value)
                        setFormResponse(newFormResponse)
                    }} />}
            </Form.Group>
        ))}
        <Button variant="success" type="submit">Submit</Button>
    </Form>
}

function TimedForm(props) {
    const [modalShown, setModalShown] = useState(false)
    let record = props.record
    if (record.type !== 'form') {
        return null
    }
    return <>
        <div className="pushed">
            <h4>Form: {record.name}</h4>
            <h5 className="pushed-spaced">
                <Icons.FaClipboardList className="hover" onClick={() => { setModalShown(true) }} />
            </h5>
        </div>
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={modalShown}
            onHide={() => setModalShown(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {record.name}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalBody record={record} hide={() => { setModalShown(false) }} />
            </Modal.Body>
        </Modal>
    </>
}

function UpNext(props) {
    const context = useContext(appContext)
    let events = generateEvent(context, props.day, props.min).events
    let habitObj = EventObject(events);
    let goals = getSomeEvents(context, ["goal"])
    console.log(goals)
    return events.length > 0 &&
        <div className="nowSide">
            <h4>Up Next</h4>
            {events.map(record =>
                <DisplayEvent noCheck={true} habitObj={habitObj} index={record._id} context={context}
                    record={record} setContext={context.setContext} all={false} />)}
        {/* <h4>Upcoming Goals</h4>
        {sortGoals(context, goals)} */}
        </div>

}

function NowContent(props) { // props: dayOfWeek, curMin
    const [triggerCaches, setTriggerCaches] = useState({})
    const context = useContext(appContext)
    const GAEvent = useGAEvent("Next Button")

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

    let event = generateEvent(context, props.day, props.min).curr
    if (event != null) {
        if (event.type === 'stack') {
            let stackedEvent = getEventById(context, event.eventList[event.pointer])
            let trigger = generateTrigger(stackedEvent)
            return <div className="dashboard">
                <div>
                </div>
                <div className="pushed">
                    <h5>
                        <Icons.FaArrowLeft className="hover" onClick={async () => {
                            context.setContext(await updateEvent(context, event, { pointer: 0 }))
                        }} />
                    </h5>
                    <h4 className="pushed-spaced">Stack: {event.name}</h4>
                </div>
                <TimedForm record={stackedEvent} />
                <h3>Event: {stackedEvent.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <Button style={{ marginBottom: "10px" }} onClick={async () => {
                    if (event.pointer === event.eventList.length - 1) {
                        context.setContext(await updateEventHistory(context, event, { "0": true }))
                    } else {
                        context.setContext(await updateEvent(context, event, { pointer: event.pointer + 1 }))
                    }
                    context.setContext(await updateEventHistory(context.getContext(), stackedEvent, { "0": true }))
                    GAEvent("Next Clicked", stackedEvent.name)
                }}>Next</Button>
                {renderTrigger(trigger)}
            </div>
        } else {
            let trigger = generateTrigger(event)
            return <div className="dashboard">
                <TimedForm record={event} />
                <h3>Event: {event.name}</h3>
                <h1>Trigger: {trigger.name}</h1>
                <Button style={{ marginBottom: "10px" }} onClick={async () => {
                    context.setContext(await updateEventHistory(context, event, { "0": true }))
                    GAEvent(event.name, "Next Clicked")
                }}>Next</Button>
                {renderTrigger(trigger)}
            </div>
        }
    } else {
        return (
            <div className="dashboard">
                <h3 className="congrats-text">
                    Congrats you're one step closer to reaching your full potential!
                    {/* <a href="https://www.youtube.com/watch?v=tmTZj0emGHw">You deserve this.</a> */}
                </h3>
                <img src="https://jamesclear.com/wp-content/uploads/2015/08/tiny-gains-graph-700x700.jpg" alt="" />
            </div>
        )
    }
}

function NowTime(props) {
    let context = useContext(appContext)
    const [min, setMin] = useState(getMin())
    const [day, setDay] = useState(getDay(context.session.isAuthed && context.session.preferences.dayStartTime))

    useEffect(() => {
        let interval = setInterval(() => {
            setMin(getMin())
            setDay(getDay(context.session.preferences.dayStartTime))
        }, 1000 * 10)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className="nowContainer">
            <div className="nowMain">
                <NowContent day={day} min={min} />
            </div>
            <UpNext day={day} min={min} />
        </div>
    )
}

function Now(props) {
    return (
        <div className="wrapper">
            <Layout name="Home" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu} />
            <div className={props.menu ? "main-content active" : "main-content"}>
                <NowTime />
            </div>
        </div>
    )
}

export { Now, TimedForm, ModalBody, NowTime };