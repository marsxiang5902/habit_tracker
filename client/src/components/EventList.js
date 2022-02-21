import React, { useState, useContext } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Row, Col, Popover, OverlayTrigger, Button, Modal, DropdownButton, Dropdown, FormControl, } from 'react-bootstrap'
import { addEvent, updateEvent, deleteEvent } from '../services/eventServices';
import { appContext } from '../context/appContext';
import { EventObject } from './EventOnChange';
import { StackBody } from './StackList';
import { Event} from './TriggerList';
import { EditForm } from './FormList';
import { ModalBody as FormEntry } from '../pages/Now';
import noCheckedHistory from '../lib/noCheckedHistory';
import DisplayEvent from './DisplayEvent';
import checkStack from '../lib/checkEventsOnDel';
import { updatePoints } from '../services/userServices';
import notDashboard from '../lib/notDashboard';
import { getEventById, getNumFormFields, getSomeEvents } from '../lib/locateEvents';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'
import { dateToDay, getDay, MILLS_IN_DAY } from '../lib/time';
import EventSelect from './EventSelect';


function capitalizeFirst(str) {
  return str[0].toUpperCase() + str.substring(1)
}

let GoalDescription = (props) => {
  const context = useContext(appContext)
  const [item, setItem] = useState(getEventById(context, props.record.goalTarget.event_id))
  const [formField, setFormField] = useState(null)
  const [value, setValue] = useState(props.record.goalTarget.value)
  const [dueDate, setDueDate] = useState(props.record.endDay === 1e9 ? getDay() : props.record.endDay)

  async function handleSubmit(e){
    e.preventDefault()
    context.setContext(await updateEvent(context, props.record, {"goalTarget" : 
                      {"event_id" : item === null ? "" : item._id, "formField" : formField === null ? "" : formField, 
                      "value" : isNaN(parseInt(value)) ? 0 : parseInt(value)}}))
    props.hide()
  }

  function changeItem(form, id, e){
    if (form){
      setItem(id.parent_name)
      setFormField(id.name)
    }
    else{
      setItem(getEventById(context, id))
      setFormField(null)
    }
  }


  return(
    <>
    <hr className="triggers-hr"></hr>
    <Form style={{height : "70vh"}} onSubmit={(e) => handleSubmit(e)}>
      <Form.Group>
        <h4>
          Linked Event
        </h4>
        <EventSelect title={item == null ? "Pick an Event" : formField == null ? item.name : formField} changeItem={changeItem} idx={0}/>
      </Form.Group>
      <Form.Group>
        <h4>
          Goal Value
        </h4>
          <p>Example: I want to lose 20lbs, so I will enter 20lbs in the box</p>
          <Form.Control style={{width : "30%"}} type="number" defaultValue={value !== undefined ? value : 0} onChange={(e) => {setValue(e.target.value)}} />
      </Form.Group>
      <Form.Group>
        <h4>
          Due Date
        </h4>
        <div style={{width: "30%"}}>
          <DatePicker className='form-control' selected={() => {let d = new Date(); d.setTime(dueDate * MILLS_IN_DAY); return d}} onChange={(date) => {setDueDate(dateToDay(date));}} dateFormat={'dd / MM / yyyy'}/>
        </div>
      </Form.Group>
      {props.record.goalTarget.event_id === "" &&
      <Form.Group>
        <h4>
          Plan
        </h4>
        <Form.Control type="text" placeholder="I will..." style={{marginBottom : "20px"}}>
        </Form.Control>
        <textarea class="form-control" placeholder="I am going to stay accountable to my goal by...">
          
        </textarea>
      </Form.Group>}
      <Button type="submit">Save Changes</Button>
    </Form>
    </>
  )
}

let EditPopover = React.forwardRef((props, ref) => {
  return <>
      <h4>{`${props.field}`}</h4>
      <Form.Group>
        <Form.Control type="text" placeholder={props.field} value={props.value} onChange={(e) => props.setValue(e.target.value)} />
      </Form.Group>
  </>
})

let ActivationPopover = React.forwardRef((props, ref) => {
  const context = useContext(appContext)
  const [activationDays, setActivationDays] = useState(props.record.activationDays)
  const [am, setAm] = useState(Math.floor(props.record.activationTime / 60) < 12)
  const [activationTimeHour, setActivationTimeHour] = useState(Math.floor(props.record.activationTime / 60))
  const [activationTimeMin, setActivationTimeMin] = useState(props.record.activationTime % 60)


  const [nameField, setNameField] = useState(props.record.name)
  const [pointField, setPointField] = useState(props.record.points)
  const [del, setDelete] = useState(false)


  async function handleEdit(event) {
    event.preventDefault();
    props.setContext(await updateEvent(context, props.record, {
      activationDays, activationTime: activationTimeHour * 60 + activationTimeMin
    }))
    props.setContext(await checkStack(context, props.record._id))
    props.setContext(await (updateEvent(context, props.record, {"points" : pointField})))
    props.setContext(await (updateEvent(context, props.record, {"name" : nameField})))
    if (del){
      props.setContext(await deleteEvent(context, props.record))
    }
    props.hidePopover()
  }

  const DAYS = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su']


  return <>
    <hr className="triggers-hr" />
    <div className="form-group">
      <Form onSubmit={e => handleEdit(e)}>
        <EditPopover record={props.record}
          value={nameField}
          setValue={setNameField}
          field={"Name"}/>
        <EditPopover
          field={"Points"}
          value={pointField}
          setValue={setPointField}/>
        {!notDashboard.has(props.type) && <>
        <h4>Schedule Notification Time</h4>
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
          <Form.Label>Notification Time</Form.Label>
          <Row>
            <Col>
              <Form.Control type="number" placeholder="Hour" label="test" value={am ? activationTimeHour - 0 : activationTimeHour - 12}
                onChange={(e) => setActivationTimeHour(parseInt(e.target.value))} />
            </Col>
            <Col sm={0.5}><h3>:</h3></Col>
            <Col>
              <Form.Control type="number" placeholder="Minute" value={activationTimeMin.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}
                onChange={(e) => setActivationTimeMin(parseInt(e.target.value))} />
            </Col>
            <Col>
              <Button variant={am ? "primary" : "outline-primary"} style={{"marginRight" : "10px"}} onClick={() => {setActivationTimeHour(am ? activationTimeHour: activationTimeHour - 12); setAm(true)}}>
                AM
              </Button>
              <Button variant={!am ? "primary" : "outline-primary"} onClick={() => {setActivationTimeHour(am ? activationTimeHour + 12 : activationTimeHour); setAm(false)}}>PM</Button>
            </Col>
          </Row>
        </Form.Group>
        </>}

        <Button className="button" variant="success" type="submit" value='change'>Change</Button>
        <Button className="button" variant="danger" type="submit" value='delete' onClick={() => setDelete(true)}>Delete</Button>
      </Form>
    </div>
  </>
})

function EventList(props) {
  const [editPopoverId, setEditPopoverId] = useState("")
  const [formModalShown, setFormModalShown] = useState(false)
  const [formRecord, setFormRecord] = useState({})

  const [formVisible, setFormVisible] = useState(false)
  const [name, setName] = useState("")
  const [curr, setCurr] = useState("Event")

  const context = useContext(appContext)
  let records = context.timedEvents[props.type]

  async function handleSubmit(event) {
    event.preventDefault();
    props.setContext(await addEvent(context, name, props.type))
    setFormVisible(false)
    setName("")
  }


  let activationField = (record) => {
    if (!noCheckedHistory.has(props.type)){
      return(
        <ActivationPopover
          record={record}
          type={props.type}
          setContext={props.setContext}
          style={{ maxWidth: '350px' }}
          hidePopover={setEditPopoverId}
        />
      )
    }
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

  let style = (label) => {
    if (label === curr){
      return "text-underline"
    }
    else{
      return "no-button-style"
    }
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
      <div style={{"display" : "flex"}}>
        <button className={style("Event")} onClick={() => setCurr("Event")}>Event</button>
        {props.type === "stack" && <button className={style("Stack")} onClick={() => setCurr("Stack")}>Stack</button>}
        {props.type === "form" && <button className={style("Form")} onClick={() => setCurr("Form")}>Form</button>}
        {props.type === "goal" && <button className={style("Goal")} onClick={() => setCurr("Goal")}>Goal</button>}
        {/* <button className={style("Points")} onClick={() => setCurr("Points")}>Points</button> */}
        {!noCheckedHistory.has(props.type) && <button className={style("Triggers")} onClick={() => setCurr("Triggers")}>Triggers</button>}
        {/* <button className={style("Accountability")} onClick={() => setCurr("Accountability")}>Accountability</button> */}
      </div>
      {curr === "Goal" && <GoalDescription record={record} hide={setEditPopoverId}/>}
      {curr === "Event" ? activationField(record) : null}
      {curr === "Triggers" && <Event setContext={props.setContext} key={_id} record={record} />}
      {curr === "Stack" && <StackBody record={record} hide={setEditPopoverId}/>}
      {curr === "Form" && <EditForm record={record} key={_id} hide={setEditPopoverId}/>}
    </Modal.Body>
    {/* <Modal.Footer>
      <Button>Save Changes</Button>
    </Modal.Footer> */}
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
