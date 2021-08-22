import React, { useState, useContext } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Row, Col, Popover, OverlayTrigger, Button, Modal, } from 'react-bootstrap'
import { addEvent, updateEvent, deleteEvent } from '../services/eventServices';
import { appContext } from '../context/appContext';
import { calcPct as pct } from '../lib/dataServices'
import { DisplayHabit, HabitObject } from './HabitList';
import { StackBody } from './StackList';
import { Event, TriggerList } from './TriggerList';
import { TimedForm } from './FormList';


function capitalizeFirst(str) {
  return str[0].toUpperCase() + str.substring(1)
}

let EditPopover = React.forwardRef((props, ref) => {
  const context = useContext(appContext)
  const [name, setName] = useState(props.record.name)
  const [del, setDelete] = useState(false)

  async function handleEdit(event) {
    event.preventDefault();
    props.setContext(await (del ? deleteEvent(context, props.record) :
      updateEvent(context, props.record, { name }))
    )
    setDelete(false)
    props.hidePopover()
  }

  return <>
  <h4>{`Edit Name`}</h4>
  <Form onSubmit={e => handleEdit(e)}>
    <Form.Group>
      <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <Button className="button" variant="success" type="submit" value='change'>Change</Button>
      <Button className="button" variant="danger" type="submit" value='delete' onClick={(e) => setDelete(true)}>Delete</Button>
    </Form.Group>
  </Form>
  </>
})

let ActivationPopover = React.forwardRef((props, ref) => {
  const context = useContext(appContext)
  const [activationDays, setActivationDays] = useState(props.record.activationDays)
  const [activationTimeHour, setActivationTimeHour] = useState(Math.floor(props.record.activationTime / 60))
  const [activationTimeMin, setActivationTimeMin] = useState(props.record.activationTime % 60)

  async function handleEdit(event) {
    event.preventDefault();
    props.setContext(await updateEvent(context, props.record, {
      activationDays, activationTime: activationTimeHour * 60 + activationTimeMin
    }))
    props.hidePopover()
  }

  const DAYS = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']

  return <>
  <hr className="triggers-hr"></hr>
  <h4>Edit Activation Days</h4>
  <div className="form-group">
  <Form onSubmit={e => handleEdit(e)}>
        <Form.Group>
          <Form.Label>Days</Form.Label>
          <Row style={{ paddingRight: "15px", paddingLeft: "15px" }}>
            {DAYS.map((day, idx) => (
              <Col style={{ padding: "0px" }}>
                <Button
                  size="sm"
                  style={{ width: 35 }}
                  variant={`${activationDays[idx] ? "" : "outline-"}primary`}
                  onClick={() => { setActivationDays({ ...activationDays, [idx]: !activationDays[idx] }) }}
                >{day}</Button>
              </Col>
            ))}
          </Row>
        </Form.Group>

        <Form.Group>
          <Form.Label>Time</Form.Label>
          <Row>
            <Col>
              <Form.Control type="number" placeholder="Hour" value={activationTimeHour}
                onChange={(e) => setActivationTimeHour(parseInt(e.target.value))} />
            </Col>
            <Col sm={0.5}><h3>:</h3></Col>
            <Col>
              <Form.Control type="number" placeholder="Minute" value={activationTimeMin}
                onChange={(e) => setActivationTimeMin(parseInt(e.target.value))} />
            </Col>
          </Row>
        </Form.Group>

        <Button className="button" variant="success" type="submit" value='change'>Change</Button>
      </Form>
      </div>
  </>
})

function EventList(props) {
  const [editPopoverId, setEditPopoverId] = useState("")
  const [activationPopoverId, setActivationPopoverId] = useState("")

  const [name, setName] = useState("")
  const [formVisible, setFormVisible] = useState(false)

  const context = useContext(appContext)
  let records = context.timedEvents[props.type]

  async function handleSubmit(event) {
    event.preventDefault();
    props.setContext(await addEvent(context, name, props.type))
    setFormVisible(false)
    setName("")
  }

  let modalBody = (record, _id) => <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={editPopoverId === _id}        
        onHide={() => setEditPopoverId("")}
        dialogClassName="custom-modal"
        bsClass="custom-modal"
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit {capitalizeFirst(props.type)}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EditPopover
                    record={record}
                    type={props.type}
                    setContext={props.setContext}
                    hidePopover={() => { setEditPopoverId("") }}/> 
          {props.type !== 'todo' ?   
          <ActivationPopover
                    record={record}
                    type={props.type}
                    setContext={props.setContext}
                    style={{ maxWidth: '350px' }}
                    hidePopover={() => { setActivationPopoverId("") }}
                  /> : null }   
          {props.type === "stack" && <StackBody record={record} />}  
          {props.type === "habit" && <Event setContext={props.setContext} key={_id} record={record}/>}    
          {props.type === "form" && <TimedForm record={record} key={_id}/>}  
        </Modal.Body>
      </Modal>
  
  if (!context.session.isAuthed){
    return null
  }
  let habitObj = HabitObject(records, true);
  if (props.type === 'habit' || props.type === 'todo'){
    habitObj = HabitObject(records, true)
  }
  return !context.timedEvents.loading && (
    <>

    {/* header */}
      <div className="subheader">
        <h2>{props.title}</h2>
        {formVisible ?
          <Icons.FaRegWindowClose onClick={() => { setFormVisible(false) }} className="hover"></Icons.FaRegWindowClose> :
          <Icons.FaRegPlusSquare onClick={() => { setFormVisible(true) }} className="hover"></Icons.FaRegPlusSquare>}
      </div>

      {/* events */}
      {Object.keys(records).map((_id, index) => {
        let record = records[_id]
        return (
          <div className="card-2 border-2" key={_id}>
            <div className="habit habit-2 inline">
              {props.type !== 'habit' && props.type !== 'todo' && <h4 className="habit no-padding-top">{record.name}</h4>}
              {/* {props.type === 'habit' && <h4 className="habit no-padding-top">{pct(record.history)}%</h4>} */}
              {(props.type === 'habit' || props.type === 'todo') && 
              <DisplayHabit onChange={habitObj.edit.checkbox} 
                            item={habitObj.value[index]} index={index} context={context} record={record}
                            setContext={props.setContext} all={true}/>
              }
            </div>
            <div>
              <Icons.FaPencilAlt
                  className={"hover"}
                  style={{ marginRight: '20px' }}
                  onClick={() => { setEditPopoverId(editPopoverId === _id ? "" : _id) }} />
              {modalBody(record, _id)}
            </div>
          </div>
        );
      }
      )}

      {/* adding new items */}
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
            </Form.Group>
          </Form>
        </div>
      </div>}
    </>
  );

}

export default EventList;
