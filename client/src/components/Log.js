import { useContext, useEffect, useState } from 'react';
import {Button, Card, Modal} from 'react-bootstrap';
import * as Icons from "react-icons/fa";
import { appContext } from '../context/appContext';
import { fillArray, maxLength } from '../lib/chartServices';
import { getEventById, getNumFormFields, getSomeEvents } from '../lib/locateEvents';
import { getPastDay } from '../lib/time';
import '../static/page.css'
import { EventObject } from './EventOnChange';
import EventSelect from './EventSelect';


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
    const [items, setItems] = useState([])
    const [selectShown, setSelectShown] = useState(false)

    const context = useContext(appContext)

    let events = getSomeEvents(props.context, ['habit', 'form'])
    let length = maxLength(events)
    let numFields = getNumFormFields(props.context)
    numFields = EventObject(numFields).value
    events = EventObject(events, false, false).value

    useEffect(() => {
        let values = [0, 1, 2]
        for (let index = 0; index < 3; index++) {
            values[index] = events[index]
            
        }
        setItems(values)
    }, [])

    function setValues(form, id, event){
        let values = [...items]
        if (form){
            values[event.target.name] = id.name
        }
        else{
            values[event.target.name] = getEventById(context, id).name
        }
        setItems(values)
    }

    for (let event in events){
        events[event] = fillArray(events, events[event])
        let temp = Object.values(events[event].data).reverse()
        events[event].data = temp
    }

    let openModal = (day) => {
        setIndex(day)
        setModalShown(true)
    }

    let EventSelectModal = () => {
        return(
            <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            show={selectShown}
            onHide={() => setSelectShown(false)}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Select Events for Card Pop Ups
                </Modal.Title>
            </Modal.Header>
                {[0, 0, 0].map((item, idx) => {
                    return(
                        <div style={{padding: "20px"}}>
                            <h4>Pick an event</h4>
                            <EventSelect title={items[idx]} changeItem={setValues} idx={idx}/>
                        </div>
                    )
                })}
                
            </Modal>
        )
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
        if(index < 3){
            let data = Object.values(item.data).reverse()
            if(!isNaN(data[props.day])){
                if(typeof(data[props.day]) === "boolean"){
                    return <>
                    <input type="checkbox" id="box" checked={data[props.day]}/>
                    <label for="box" style={{paddingLeft: "10px"}}>{item.name}</label>
                    <hr></hr>
                    </>
                }
                else if(typeof(data[props.day]) === "number"){
                    return <>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p style={{marginBottom: "0px"}}>{item.name}</p>
                    <p style={{marginBottom: "0px"}}>{data[props.day]}</p>
                    </div>
                    <hr></hr>
                    </>
                }
            }
        }
    })}
  </div>

    return <>
    <div>
        <div style={{display : 'flex', 'justifyContent':'center'}}>
            <Button variant="dark" onClick={() => setSelectShown(true)}>Customize Popups</Button>
        </div>
        <EventSelectModal />
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