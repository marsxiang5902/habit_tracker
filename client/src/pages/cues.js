import React, { useContext } from 'react';
import '../static/page.css'
import { CuesList } from '../components/cue-list';
import { appContext } from '../context/appContext';
import Layout from '../components/layout';



function Cues(props) {
    let context = useContext(appContext)
    let habits = context.timedEvents.habit
    let cues = context.timedEvents.cue
    return (
        <>
            <Layout name="🗺 THE TRIGGERS" handleLogout={props.handleLogout}></Layout>
            {habits.map((item, index) => {
                return (
                    <CuesList habit={item} index={index} cues={cues} setContext={props.setContext} context={context}></CuesList>
                )
            })}
        </>
    )


}

export default Cues;
