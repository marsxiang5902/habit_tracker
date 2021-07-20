'use strict'

import React, { useEffect, useState } from 'react';
import { renderCueResource } from '../components/cue-list';
import Layout from '../components/layout';


function DashboardContent(props) {
    const [cue, setCue] = useState(null)
    const [event, setEvent] = useState(null)

    let generateCue = () => {
        let id2habit = {}
        if (props.habits) {
            props.habits.forEach(habit => {
                id2habit[habit._id] = habit
            })
        }
        let curCue = null, curEvent = null;
        if (props.cues) {
            props.cues.forEach((cue) => {
                try {
                    let [link, type, eventId] = cue.resourceURL.split(' ')
                    if (eventId && eventId in id2habit) {
                        let event = id2habit[eventId]
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
        let [newCue, newEvent] = generateCue()
        setCue(newCue)
        setEvent(newEvent)
    }, [cue, event])

    return (
        cue ? (
            <div>
                <h1>{event.name}</h1>
                {renderCueResource(cue)}
            </div>
        ) : (
            <h1>All Done!</h1>
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