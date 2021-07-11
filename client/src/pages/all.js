'use strict'

import React, { useState, useEffect } from "react";
import './page.css'
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icons from "react-icons/fa";
import MyHabitForm from '../components/form'
import DataList from '../components/data-list'


const pct = (items) => {
    let count = 0;
    let avg;
    try {
        for (let i = 0; i < items.length; i++) {
            if (items[i] === 1) {
                count += 1;
            }
        }
        avg = (count / items.length) * 100;
    }
    //if new habit
    catch (err) {
        avg = 0;
    }
    return Math.floor(avg);
}

function All(props) {

    return (
        <>
            <div className="formatter">
                <div className="container" id="habits">
                    <DataList addedData={props.addedData} data={props.habits} addData={props.addData} changeData={props.changeData} title="Daily Habits" type="Habit"/>
                </div>
                <div className="container" id="todos">
                    <DataList addedData={props.addedData} data={props.todos} addData={props.addData} title="Todos" type="Todo" />
                </div>
                <div className="container" id="weeklygoal">
                    <DataList addedData={props.addedData} data={props.weeklyGoals} addData={props.addData} title="Weekly Goals" type="Weekly Goal" />
                </div>
                {/* propbably limit this to three for helping people focus (no add button) */}
                <div className="container" id="priorities">
                    <DataList addedData={props.addedData} data={props.priorities} addData={props.addData} title="Priorities" type="Priority" />
                </div>
            </div>
        </>
    );
}

export default All;