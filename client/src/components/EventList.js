import React, { useState, useContext } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Row, Col, Popover, OverlayTrigger, Button, } from 'react-bootstrap'
import { addEvent, updateEvent, deleteEvent } from '../services/eventServices';
import { appContext } from '../context/appContext';
import { calcPct as pct } from '../lib/dataServices'


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

  return <Popover {...props} ref={ref} id="popover-basic">
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

  return <Popover ref={ref} {...props} id="popover-basic">
    <Popover.Title as="h3">{`Edit ${capitalizeFirst(props.type)}`}</Popover.Title>
    <Popover.Content>
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
    </Popover.Content>
  </Popover>
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

  return !context.timedEvents.loading && (
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
              {props.type === 'habit' && <h4 className="habit no-padding-top">{pct(record.checkedHistory)}%</h4>}
              <h4 className="habit no-padding-top">{record.name}</h4>
            </div>
            <div>
              {props.type !== 'todo' &&
                <OverlayTrigger
                  trigger="click"
                  placement="left"
                  overlay={<ActivationPopover
                    record={record}
                    type={props.type}
                    setContext={props.setContext}
                    style={{ maxWidth: '350px' }}
                    hidePopover={() => { setActivationPopoverId("") }}
                  />}
                  show={activationPopoverId === _id}>
                  <Icons.FaCalendarAlt
                    className="hover"
                    style={{ marginRight: '20px' }}
                    onClick={() => { setActivationPopoverId(activationPopoverId === _id ? "" : _id) }} />
                </OverlayTrigger>
              }

              <OverlayTrigger
                trigger="click"
                placement="left"
                overlay={<EditPopover
                  record={record}
                  type={props.type}
                  setContext={props.setContext}
                  hidePopover={() => { setEditPopoverId("") }}
                />}
                show={editPopoverId === _id}>
                <Icons.FaPencilAlt
                  className="hover"
                  style={{ marginRight: '20px' }}
                  onClick={() => { setEditPopoverId(editPopoverId === _id ? "" : _id) }} />
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
