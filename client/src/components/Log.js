import { useState } from 'react';
import {Card, Modal} from 'react-bootstrap';
import * as Icons from "react-icons/fa";
import { fillArray, maxLength } from '../lib/chartServices';
import { getNumFormFields, getSomeEvents } from '../lib/locateEvents';
import { getPastDay } from '../lib/time';
import '../static/page.css'
import { HabitObject } from './HabitList';


//find similar days
//filter for words

//previews, date, day -> also index for events
//why are all dates back by 1

function ModalBody(props){
    let events = props.events
    return( <>
    <h3>Habits</h3>
    {events.map((item, index) => {
        let data = Object.values(item.data).reverse()
        if (item.type === "habit" && !isNaN(data[props.day])){
        return <div>
        <input type="checkbox" id="box" checked={data[props.day]}/>
        <label for="box" style={{paddingLeft: "10px"}}>{item.name}</label>
        </div>
        }
    })}
    <hr className="triggers-hr"/>
    <h3>Form Fields</h3>
    {events.map((item, index) => {
        let data = Object.values(item.data).reverse()
        if (item.type === "form" && (!isNaN(data[props.day])) || typeof(data[props.day]) === "string"){
            return <>
                    <div className={typeof(data[props.day]) === "number" ? "card-2 border-2" : "border-2"}>
                    <h5>{item.name}</h5>
                    <p>{data[props.day]}</p>
                    </div>
                    <hr />
                    </>
        }
    })}
    </>
    )
}

function DisplayEntries(props){

    const [modalShown, setModalShown] = useState(false)
    const [idx, setIndex] = useState(null)

    let events = getSomeEvents(props.context, ['habit', 'form'])
    let length = maxLength(events)
    let numFields = getNumFormFields(props.context)
    numFields = HabitObject(numFields).value
    console.log(numFields)
    events = HabitObject(events, false, false).value

    for (let event in events){
        events[event] = fillArray(events, events[event])
        let temp = Object.values(events[event].data).reverse()
        events[event].data = temp
    }

    let openModal = (day) => {
        setIndex(day)
        setModalShown(true)
    }

    let CardModal = (props) => (<Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShown}
        onHide={() => setModalShown(false)}
      >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                {getPastDay(length.length - idx)}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ModalBody day={idx} events={events} hide={() => { setModalShown(false) }} />
        </Modal.Body>
      </Modal>)
      

    let DayCard = (props) => <div className="border-2 log-card">
    <div className="subheader">
        <Card.Title>{getPastDay(length.length - props.day)}</Card.Title>
        <div onClick={() => {openModal(props.day)}}>
            <Icons.FaExpandAlt className="hover"/>
        </div>
    </div>
    <Card.Text>
        Day {props.day}
    </Card.Text>
    <hr className="triggers-hr" style={{width: "100%"}}/>
    {events.map((item, index) => {
        let data = Object.values(item.data).reverse()
        if(!isNaN(data[props.day])){
            if(typeof(data[props.day]) === "boolean"){
                return <>
                <input type="checkbox" id="box" checked={data[props.day]}/>
                <label for="box" style={{paddingLeft: "10px"}}>{item.name}</label>
                <hr />
                </>
            }
        }
    })}
  </div>

    return <>
    <div>
        <div className="log-formatter">
        {length.map(item => {
            return <>
            <DayCard day={item}/>
            </>
        })}
        <CardModal />
        </div>
    </div>
    </>
}

export {DisplayEntries}