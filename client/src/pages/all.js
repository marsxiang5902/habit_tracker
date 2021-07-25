'use strict'

import React, { useState, useEffect } from "react";
import '../static/page.css'
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataList from '../components/data-list'



function All(props) {
    return (
        <>
            <div className="formatter">
                <div className="container" id="habits">
                    <DataList addedData={props.addedData} data={props.habits} addData={props.addData} changeData={props.changeData} cues={props.cues} title="Daily Habits" type="Habit" />
                </div>
                <div className="container" id="todos">
                    <DataList addedData={props.addedData} data={props.todos} addData={props.addData} changeData={props.changeData} title="Todos" type="Todo" />
                </div>
                {/* <div className="container" id="weeklygoal">
                    <DataList addedData={props.addedData} data={props.weeklyGoals} addData={props.addData} changeData={props.changeData} title="Weekly Goals" type="Weekly Goal" />
                </div>
                propbably limit this to three for helping people focus (no add button)
                <div className="container" id="priorities">
                    <DataList addedData={props.addedData} data={props.priorities} addData={props.addData} changeData={props.changeData} title="Priorities" type="Priority" />
                </div> */}
            </div>
        </>
    );
}

export default All;