'use strict'

import React, { useState } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button, Modal } from 'react-bootstrap'
import '../static/page.css'
import CuesList from '../components/cue-list';



function Cues(props) {
    return (
        <>
            {props.habits.map((item, index) => {
                return (
                    <CuesList habit={item} index={index} cues={props.cues} addData={props.addData}></CuesList>
                )
            })}
        </>
    )


}

export default Cues;
