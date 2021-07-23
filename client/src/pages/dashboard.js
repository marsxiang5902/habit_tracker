'use strict'

import React, { useEffect, useState } from 'react';
import { renderCueResource } from '../components/cue-list';
import Layout from '../components/layout';
import '../static/page.css'


function DashboardContent(props) {
    const [cue, setCue] = useState(null)
    const [event, setEvent] = useState(null)

    let generateCue = () => {
        let id2habit = {}
        if (props.habits) {
            props.habits.forEach(event => {
                id2habit[event._id] = event
            })
        }
        let curCue = null, curEvent = null;
        if (props.cues) {
            props.cues.forEach((cue) => {
                try {
                    let [link, type, eventId] = cue.resourceURL.split(' ')
                    if (eventId && eventId in id2habit) {
                        let event = id2habit[eventId]
                        console.log(event)
                        if (event.completion && '0' in event.completion) {
                            if (!event.completion[0] && (!curCue || Math.random() < 0.5)) {
                                curCue = cue
                                curEvent = event
                            }
                        }
                    }
                } catch (err) { }
            })
        }
        return [curCue, curEvent];
    }

    useEffect(() => {
        console.log(props)
        let [newCue, newEvent] = generateCue()
        setCue(newCue)
        setEvent(newEvent)
    }, [JSON.stringify(props)])

    return (
        cue ? (
            <div className="dashboard">
                <h3>Habit: {event.name}</h3>
                <h1>Cue: {cue.name}</h1>
                <div className="parent">
                    {renderCueResource(cue)}
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
            <DashboardContent cues={props.cues} habits={props.habits} />
        </>
    )
}

export default Dashboard;