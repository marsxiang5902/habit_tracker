'use strict'

import React, { useState } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button, Modal } from 'react-bootstrap'


function HabitList(props) {

    const [formVisible, setFormVisible] = useState(false)
    const [name, setName] = useState("")
    const [popoverVisible, setPopoverVisible] = useState(-1)
    const [del, setDelete] = useState(false)
    const [modalShow, setModalShow] = useState(false);
    const [cueVisible, setCueVisible] = useState(false);

    function pct(items){
        let count = 0;
        let avg;
        try {
            for (let i = 0; i < items.length; i++) {
                if (items[i] === true) {
                    count += 1;
                }
            }
            if (count === 0){
                avg = 0
            }
            else{
                avg = (count / items.length) * 100;
            }
        }
        //if new habit
        catch (err) {
            avg = 0;
        }
        return Math.floor(avg);
    }



    function handleEdit(event) {
        event.preventDefault();
        props.changeData(name, popoverVisible, del, props.type)
        setDelete(false)
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
                        <Form.Control type="text" placeholder={`${props.type} Name`} value={name} onChange={(e) => setName(e.target.value)} />
                        <Button className="button" variant="success" type="submit" value='change'>Change</Button>
                        <Button className="button" variant="danger" type="submit" value='delete' onClick={(e) => setDelete(true)}>Delete</Button>
                    </Form.Group>
                </Form>
            </Popover.Content>
        </Popover>
    );

    const test = () => (
        <div className="parent">
            <img src={props.type === "Habit" ? 'https://drive.google.com/file/d/10be3xLM_uDyIOiusK3Jd36tjL87gOsZI/view?usp=sharing' : null} alt=""></img>
        </div>
    )



    return (
        <>
            <div className="subheader">
                <h2>{props.title}</h2>
                {!formVisible ?
                    <Icons.FaRegPlusSquare onClick={() => { setFormVisible(true) }} className="hover"></Icons.FaRegPlusSquare> :
                    <Icons.FaRegWindowClose onClick={() => { setFormVisible(false) }} className="hover"></Icons.FaRegWindowClose>}
            </div>
            {props.data.map((item, index) => {
                console.log(item)
                return (
                    <div className="card-2 border-2" key={index}>

                        <div className="habit habit-2 inline">
                        {item.type === 'habit' ? <h4 className="habit no-padding-top">{pct(item.completion)}%</h4> : null}
                            <h4 className="no-padding-top">{item.name}</h4>
                            {/* <p>{item.description}</p> */}
                        </div>
                        <div>
                            <OverlayTrigger trigger="click" placement="left" overlay={popover(index)} show={popoverVisible === index ? true : false}>
                                <Icons.FaPencilAlt className="hover" style={{ marginRight: '20px' }} onClick={(e) => { setPopoverVisible(popoverVisible === index ? -1 : index) }}></Icons.FaPencilAlt>
                            </OverlayTrigger>
                            {/* <Icons.FaPlusCircle className="hover" style={{marginRight:'20px'}} onClick={() => setModalShow(true)}></Icons.FaPlusCircle> */}
                        </div>
                    </div>
                );
            }
            )}
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
