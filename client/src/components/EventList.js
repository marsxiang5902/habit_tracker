import React, { useState, useContext } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Row, Col, Popover, OverlayTrigger, Button, Modal, } from 'react-bootstrap'
import { addEvent, updateEvent, deleteEvent } from '../services/eventServices';
import { appContext } from '../context/appContext';
import { calcPct as pct } from '../lib/dataServices'
import { EventObject } from './EventOnChange';
import { StackBody } from './StackList';
import { Event, TriggerList } from './TriggerList';
import { EditForm } from './FormList';
import { ModalBody as FormEntry } from '../pages/Now';
import noCheckedHistory from '../lib/noCheckedHistory';
import DisplayEvent from './DisplayEvent';
import checkStack from '../lib/checkStacksOnDel';


function capitalizeFirst(str) {
  return str[0].toUpperCase() + str.substring(1)
}

let EditPopover = React.forwardRef((props, ref) => {
  const context = useContext(appContext)
  const [name, setName] = useState(props.record.name)
  const [del, setDelete] = useState(false)

  async function handleEdit(event) {
    event.preventDefault();
    props.setContext(await checkStack(context, props.record._id))
    props.setContext(await (del ? deleteEvent(context.getContext(), props.record) :
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
  const [formModalShown, setFormModalShown] = useState(false)
  const [formRecord, setFormRecord] = useState({})

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

  let formModal = () => <Modal
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    show={formModalShown}
    onHide={() => setFormModalShown(false)}
  >
    <Modal.Header closeButton>
      <Modal.Title id="contained-modal-title-vcenter">
        {formRecord.name}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <FormEntry record={formRecord} hide={() => { setFormModalShown(false) }} />
    </Modal.Body>
  </Modal>

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
        hidePopover={() => { setEditPopoverId("") }} />
      {!noCheckedHistory.has(props.type) &&
        <ActivationPopover
          record={record}
          type={props.type}
          setContext={props.setContext}
          style={{ maxWidth: '350px' }}
          hidePopover={() => { setActivationPopoverId("") }}
        />}
      {!noCheckedHistory.has(props.type) && <Event setContext={props.setContext} key={_id} record={record} />}
      {props.type === "stack" && <StackBody record={record} />}
      {props.type === "form" && <EditForm record={record} key={_id} />}
    </Modal.Body>
  </Modal>

  if (!context.session.isAuthed) {
    return null
  }
  let habitObj = EventObject(records, true);
  return !context.timedEvents.loading && (
    <>

      {/* header */}
      <div className="subheader">
        <h2 style={{ "fontWeight": "bolder" }}>{props.title}</h2>
        {formVisible ?
          <Icons.FaRegWindowClose onClick={() => { setFormVisible(false) }} className="hover"></Icons.FaRegWindowClose> :
          <Icons.FaRegPlusSquare onClick={() => { setFormVisible(true) }} className="hover"></Icons.FaRegPlusSquare>}
      </div>

      {/* load all events */}
      {Object.keys(records).map((_id, index) => {
        let record = records[_id]
        return (
          <DisplayEvent habitObj={habitObj} index={index} context={context} record={record} setContext={props.setContext} all={true}>
            {record.type === "form" ? <Icons.FaClipboardList className="hov hover" style={{ marginRight: '20px' }}
              onClick={() => { setFormModalShown(true); setFormRecord(record) }} /> : null}

            <div className="inline">
              {/* 2 day rule circle */}
              {record.checkedHistory !== undefined && record.type === 'habit' && !record.checkedHistory['0'] && !record.checkedHistory['1'] &&
                <div className="circle" style={{ "marginRight": '15px', 'marginTop': '4px' }}>
                </div>
              }
              {
                (record.type === "habit" || record.type === "todo" || record.type === "goal") &&
                <div style={{ "marginRight": '15px' }}>
                  <Icons.FaStar className={record.starred ? "star hover" : "hov hover"}
                    onClick={async () => { props.setContext(await updateEvent(context, record, { 'starred': !record.starred })) }} />
                </div>
              }
              <div className="hov hover">
                <Icons.FaEllipsisH style={{ marginRight: '20px' }}
                  onClick={() => { setEditPopoverId(editPopoverId === _id ? "" : _id) }} />
              </div>
            </div>
            {modalBody(record, _id)}
            {formModal(record)}
          </DisplayEvent>
        );
      }
      )}

      {/* adding new events */}
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
