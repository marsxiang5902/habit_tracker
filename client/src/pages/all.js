import React, { useState } from "react";
import './page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icons from "react-icons/fa";


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
            <div className="container">
                <div className="subheader">
                    <h2>Daily Habits</h2>
                    <Icons.FaPlus></Icons.FaPlus>
                </div>
                {props.habits.map((item, index) => {
                    return (
                        <div className="card-2 border-2">

                            {/* <h4 className="habit">{pct(item.done)}%</h4> */}
                            <div className="habit habit-2">
                                <h5>{item.name}</h5>
                                {/* <p>{item.description}</p> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

export default All;