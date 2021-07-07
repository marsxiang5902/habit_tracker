import React, { useState, useEffect } from "react";
import './page.css'
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import * as Icons from "react-icons/fa";
import MyHabitForm from '../components/form'


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

    const temp = props.addHabit

    function handleSubmit(event){
        event.preventDefault();
        console.log(habitName)
        props.addHabit(habitName)
        setHabitFormVisible(false)
        setHabitName("")
    }

    return (
        <>
            <div className="container">
                <div className="subheader">
                    <h2>Daily Habits</h2>
                    {!habitFormVisible ? 
                    <Icons.FaRegPlusSquare onClick={() => {setHabitFormVisible(true)}} className="hover"></Icons.FaRegPlusSquare> : 
                    <Icons.FaRegWindowClose onClick={() => {setHabitFormVisible(false)}} className="hover"></Icons.FaRegWindowClose>}
                </div>
                {props.habits.map((item, index) => {
                    return (
                        <div className="card-2 border-2" key={index}>

                            {/* <h4 className="habit">{pct(item.done)}%</h4> */}
                            <div className="habit habit-2">
                                <h5>{item.name}</h5>
                                {/* <p>{item.description}</p> */}
                            </div>
                        </div>
                    );
                })}
                {props.addedHabits.map((item, index) => {
                    return (
                        <div className="card-2 border-2" key={index}>

                            {/* <h4 className="habit">{pct(item.done)}%</h4> */}
                            <div className="habit habit-2">
                                <h5>{item.name}</h5>
                                {/* <p>{item.description}</p> */}
                            </div>
                        </div>
                    );
                })}
                {habitFormVisible ? 
                <div className="card-2 border-2">
                    <div className="form-padding">
                        {/* <MyHabitForm habitName={habitName} setName={setHabitName} visible={setHabitFormVisible} updateHabits={props.addHabit}/> */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Add a New Habit</Form.Label>
                                <Form.Control type="text" placeholder="Habit Name" value={habitName} onChange={(e) => setHabitName(e.target.value)}/>
                                <Form.Text className="text-muted">
                                Example - Meditate 15 minutes per day
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>
                </div> : null}

            </div>
        </>
    );
}

export default All;