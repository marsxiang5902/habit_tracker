import React, { useState, useContext } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button } from 'react-bootstrap'
import { addEvent, updateEvent, deleteEvent } from '../services/eventServices';
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
function capitalizeFirst(str) {
    return str[0].toUpperCase() + str.substring(1)
}

function EventList(props) {
    const [formVisible, setFormVisible] = useState(false)
    const [name, setName] = useState("")
    const [popoverVisible, setPopoverVisible] = useState("")
    const [del, setDelete] = useState(false)
    const context = useContext(appContext)

    let records = context.timedEvents[props.type]

    async function handleEdit(event) {
        event.preventDefault();
        props.setContext(await (del ? deleteEvent(context, records[popoverVisible]) :
            updateEvent(context, records[popoverVisible], { name })))
        setDelete(false)
        setPopoverVisible("")
        setName("")
    }

    async function handleSubmit(event) {
        event.preventDefault();
        props.setContext(await addEvent(context, name, props.type))
        setFormVisible(false)
        setName("")
    }

    const popover = (record) => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">{`Edit ${capitalizeFirst(props.type)}`}</Popover.Title>
            <Popover.Content>
                <Form onSubmit={e => handleEdit(e)}>
                    <Form.Group>
                        <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
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
                {formVisible ?
                    <Icons.FaRegWindowClose onClick={() => { setFormVisible(false) }} className="hover"></Icons.FaRegWindowClose> :
                    <Icons.FaRegPlusSquare onClick={() => { setFormVisible(true) }} className="hover"></Icons.FaRegPlusSquare>}
            </div>
            {Object.keys(records).map(_id => {
                let record = records[_id]
                return (
                    <div className="card-2 border-2" key={_id}>
                        <div className="habit habit-2 inline">
                            {record.type === 'habit' && <h4 className="habit no-padding-top">{pct(record.history)}%</h4>}
                            <h4 className="habit no-padding-top">{record.name}</h4>
                        </div>
                        <div>
                            <OverlayTrigger trigger="click" placement="left" overlay={popover(record)} show={popoverVisible === _id}>
                                <Icons.FaPencilAlt className="hover" style={{ marginRight: '20px' }} onClick={(e) => { setPopoverVisible(popoverVisible === _id ? "" : _id) }}></Icons.FaPencilAlt>
                            </OverlayTrigger>
                        </div>
                    </div>
                );
            }
            )}
            {formVisible && <div className="card-2 border-2">
                <div className="form-padding">
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>{`Add A New ${capitalizeFirst(props.type)}`}</Form.Label>
                            <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                            <Button className="button" variant="success" type="submit" value='add'>Add</Button>
                            <Button className="button" variant="danger" value='cancel' onClick={() => {
                                setName(""); setFormVisible(false);
                            }}>Cancel</Button>
                            {/* <Form.Text className="text-muted">
                                Example - Meditate 15 minutes per day
                                </Form.Text> */}
                        </Form.Group>
                    </Form>
                </div>
            </div>}
        </>
    );

}

export default EventList;
