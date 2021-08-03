import React, { useState, useContext } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button, Modal } from 'react-bootstrap'
import { deleteData, addData, changeData } from './helperFunctions';
import { appContext } from '../context/appContext';

function pct(items) {
    try {
        let cnt = 0;
        for (let key in items) {
            if (items[key]) ++cnt;
        }
        return Math.floor(100 * cnt / Object.keys(items).length)
    } catch (err) { console.log(err); return 0; }
}

function HabitList(props) {

    const [formVisible, setFormVisible] = useState(false)
    const [name, setName] = useState("")
    const [popoverVisible, setPopoverVisible] = useState(-1)
    const [del, setDelete] = useState(false)

    let context = useContext(appContext)


    async function handleEdit(event) {
        event.preventDefault();
        if(del) {
            props.setContext(await deleteData(context, popoverVisible, props.type==="Habit" ? "habit":"todo"))
        }
        else { 
            props.setContext(await changeData(context, { name: name }, popoverVisible, props.type==="Habit" ? "habit":"todo"))
        }
        setDelete(false)
        setPopoverVisible(-1)
        setName("")
    }

    async function handleSubmit(event) {
        event.preventDefault();
        props.setContext(await addData(context, name, props.type==="Habit" ? "habit":"todo"))
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

                        <div className="habit habit-2 inline">
                            {item.type === 'habit' ? <h4 className="habit no-padding-top">{pct(item.history)}%</h4> : null}
                            <h4 className="habit no-padding-top">{item.name}</h4>
                            {/* <p>{item.description}</p> */}
                        </div>
                        <div>
                            <OverlayTrigger trigger="click" placement="left" overlay={popover(index)} show={popoverVisible === index ? true : false}>
                                <Icons.FaPencilAlt className="hover" style={{ marginRight: '20px' }} onClick={(e) => { setPopoverVisible(popoverVisible === index ? -1 : index) }}></Icons.FaPencilAlt>
                            </OverlayTrigger>
                        </div>
                    </div>
                );
            }
            )}
            {formVisible ?
                <div className="card-2 border-2">
                    <div className="form-padding">
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
