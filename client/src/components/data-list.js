'use strict'

import React, { useState } from 'react';
import * as Icons from "react-icons/fa";
import {Form, Popover, OverlayTrigger, Button} from 'react-bootstrap'


function HabitList(props) {

    const [formVisible, setFormVisible] = useState(false)
    const [name, setName] = useState("")
    const [popoverVisible, setPopoverVisible] = useState(-1)
    const [del, setDelete] = useState(false)

    function handleEdit(event) {
        event.preventDefault();
        props.changeData(name, popoverVisible, del)
        setPopoverVisible(-1)
        setName("")
    }

    function handleSubmit(event) {
        event.preventDefault();
        console.log(event.target.value)
        props.addData(name, props.type)
        setFormVisible(false)
        setName("")
    }

    const popover = (index) => (
        <Popover id="popover-basic">
          <Popover.Title as="h3">Edit {props.type}</Popover.Title>
          <Popover.Content>
            <Form onSubmit={(e) => handleEdit(e, index, false)}>
            <Form.Group>
                <Form.Control type="text" placeholder={`${props.type} Name`} value={name} onChange={(e) => setName(e.target.value)}/>
                <Button className="button" variant="success" type="submit" value='change'>Change</Button>
                <Button className="button" variant="danger" type="submit" value='delete' onClick={(e) => setDelete(true)}>Delete</Button>
            </Form.Group>
            </Form>
          </Popover.Content>
        </Popover>
    );


    return (
        <>
            <div className="subheader">
                <h2>{props.title}</h2>
                {!formVisible ?
                    <Icons.FaRegPlusSquare onClick={() => { setFormVisible(true) }} className="hover"></Icons.FaRegPlusSquare> :
                    <Icons.FaRegWindowClose onClick={() => { setFormVisible(false) }} className="hover"></Icons.FaRegWindowClose>}
            </div>
            {props.data.map((item, index) => {
                return (
                    <div className="card-2 border-2" key={index}>

                            {/* <h4 className="habit">{pct(item.done)}%</h4> */}
                            <div className="habit habit-2">
                                <h5>{item.name}</h5>
                                {/* <p>{item.description}</p> */}
                            </div>
                            <OverlayTrigger trigger="click" placement="left" overlay={popover(index)} show={popoverVisible === index ? true: false}>
                                <Icons.FaPencilAlt className="hover" style={{marginRight:'20px'}} onClick={(e) => {setPopoverVisible(popoverVisible === index ? -1: index)}}></Icons.FaPencilAlt>
                            </OverlayTrigger>
                        </div>
                    );
                })}
                {formVisible ? 
                <div className="card-2 border-2">
                    <div className="form-padding">
                        {/* <MyHabitForm name={name} setName={setName} visible={setFormVisible} updateHabits={props.addHabit}/> */}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Add a New {props.type}</Form.Label>
                                <Form.Control type="text" placeholder={`${props.type} Name`} value={name} onChange={(e) => setName(e.target.value)} />
                                {/* <Form.Text className="text-muted">
                                Example - Meditate 15 minutes per day
                                </Form.Text> */}
                            </Form.Group>
                        </Form>
                    </div>
                </div> : null}

        </>
    );

}

export default HabitList;
