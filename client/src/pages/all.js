import React, { useState, useEffect } from "react";
import './page.css'
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icons from "react-icons/fa";
import MyHabitForm from '../components/form'
import HabitList from '../components/habit-list'


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


    const [habitFormVisible, setHabitFormVisible] = useState(false)
    const [habitName, setHabitName] = useState("")

    function handleSubmit(event){
        event.preventDefault();
        console.log(habitName)
        props.addHabit(habitName)
        setHabitFormVisible(false)
        setHabitName("")
    }

    return (
        <>
            <HabitList addedHabits={props.addedHabits} habits={props.habits} addHabit={props.addHabit}/>
        </>
    );
}

export default All;