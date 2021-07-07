import React, {useState} from 'react';
import {Form, Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


function AddHabitForm(props){

    function handleSubmit(event){
        event.preventDefault();
        console.log(props.habitName)
        props.visible(false)
        props.addHabit(props.habitName)
        props.setName("")
    }


    return(
        <>
            <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Add a New Habit</Form.Label>
                            <Form.Control type="text" placeholder="Habit Name" value={props.habitName} onChange={(e) => props.setName(e.target.value)}/>
                            <Form.Text className="text-muted">
                            Example - Meditate 15 minutes per day
                            </Form.Text>

                            {/* <Form.Control type="text" placeholder="Habit Description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                            <Form.Text className="text-muted">
                            Example - Have mental superpowers
                            </Form.Text>
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
            </Button>   </Form.Group> */}
                        </Form.Group>
            </Form>          
        </>
    )
}

export default AddHabitForm;

