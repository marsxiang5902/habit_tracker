'use strict'

import React from 'react';
import '../static/page.css'
import { CuesList } from '../components/cue-list';



function Cues(props) {
    return (
        <>
            {props.habits.map((item, index) => {
                return (
                    <CuesList habit={item} index={index} cues={props.cues} addData={props.addData} changeData={props.changeData}></CuesList>
                )
            })}
        </>
    )


}

export default Cues;
