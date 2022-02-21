import { useContext, useEffect, useState } from 'react';
import {Button, Card, Modal} from 'react-bootstrap';
import * as Icons from "react-icons/fa";
import { appContext } from '../context/appContext';
import { fillArray, maxLength } from '../lib/chartServices';
import { getEventById, getNumFormFields, getSomeEvents } from '../lib/locateEvents';
import { getPastDay } from '../lib/time';
import { ModalBody as FormModal } from '../pages/Now'
import { updateEvent, updateEventHistory } from '../services/eventServices';
import { updatePoints } from '../services/userServices';
import '../static/page.css'
import DisplayEvent from './DisplayEvent';
import { EventObject } from './EventOnChange';
import EventSelect from './EventSelect';


//find similar days
//filter for words

//previews, date, day -> also index for events
//why are all dates back by 1

function PopUpBody(props){
    let events = Object.values(props.events)
    let habits = Object.values(getSomeEvents(props.context, ['habit']))
    let forms = Object.values(getSomeEvents(props.context, ['form']))

    async function updateHabit(record, idx){
        let data = Object.values(record.checkedHistory).reverse()
        let value = !data[props.day]
        let index = props.day - data.length + 1

        events[idx].data[props.day] = value

        if(index === 0){
            let points = parseInt(props.context.session.pointsHistory['0'])
            //it was originally checked
            if (record.checkedHistory['0']){
                props.context.setContext(await updatePoints(props.context, {0 : Math.max(points - parseInt(record.points), 0)}))
            }
            else {
                props.context.setContext(await updatePoints(props.context, {0 : points + parseInt(record.points)}))
            }
        }

        let context = props.context.getContext()
        context.setContext(await updateEventHistory(props.context, record, {[index] : value})) 

        props.updateEvents(events);
    }
    return( <>
    <h3>Habits</h3>
    {events.map((item, index) => {
        let data = Object.values(item.data).reverse()
        if (item.type === "habit" && !isNaN(data[props.day])){
            return( 
            <div key={index}>
                {/* {props.editable ? <input type="checkbox" id="box" checked={data[props.day]} onClick={() => {updateHabit(habits[index], index)}} onChange={() => {}}/> : 
                                <><input type="checkbox" id="box" checked={data[props.day]} readOnly/>                 
                                </>} */}
                <input type="checkbox" id="box" checked={data[props.day]} readOnly/> 
                <label style={{paddingLeft: "10px"}}>{item.name}</label>                                
            </div>
        )}
    })}
    <hr className="triggers-hr"/>
    <h3>Form Fields</h3>
    {forms.map((item, index) => {
        if (item.type === "form"){
            return(
                <div style={{paddingBottom : "10px"}}>
                    <details>
                        <summary>{item.name}</summary>
                        {/* {props.editable ? <FormModal record={item} hide={() => {}} day={props.day} editable={true}/> :
                        (!isNaN(data[props.day]) || typeof(data[props.day]) === "string") && 
                        <div key={index}>
                            <div className="border-2">
                            <h5>{props.eventObject[index].name}</h5>
                            <p>{data[props.day]}</p>
                            </div>
                            <hr />
                        </div>
                        <FormModal record={item} hide={() => {}} day={props.day} editable={false}/> */}
                        {events.map((event, idx) => {
                            if(event.id === item._id){
                                let data = Object.values(event.data).reverse()
                                if(!isNaN(data[props.day]) || typeof(data[props.day]) === "string"){
                                    return(
                                        <div key={index}>
                                            <div className="border-2">
                                            <h5>{event.name}</h5>
                                            <p>{data[props.day]}</p>
                                            </div>
                                            <hr />
                                        </div>
                                    )
                                }
                            }
                        })
                        }
                    </details>
                </div>
            )
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
    const [editable, setEditable] = useState(false)
    const [events, setEvents] = useState([])

    const context = useContext(appContext)

    let tempEvents = getSomeEvents(context, ['habit', 'form'])
    let length = maxLength(tempEvents)
    let numFields = getNumFormFields(context)
    tempEvents = EventObject(tempEvents, false, false).value

    useEffect(() => {
        setEvents(tempEvents)
        let values = [0, 1, 2]
        for (let index = 0; index < 3; index++) {
            values[index] = tempEvents[index]
        }
        setItems(values)
    }, [])

    function setValues(form, id, event){
        let values = [...items]
        if (form){
            values[event.target.name] = id
        }
        else{
            for(let i in events){
                if(events[i].id === id){
                    values[event.target.name] = events[i]
                    break
                }
            }
        }
        setItems(values)
    }

    function updateEvents(updEvents){
        setEvents(updEvents)
        let values = [...items]
        for(let i in values){
            let value = values[i]
            for(let j in events){
                if(value.id === events[j].id){
                    values[i] = events[j]
                    break
                }
            }
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
                {items.map((item, idx) => {
                    return(
                        <div style={{padding: "20px"}} key={idx}>
                            <h4>Pick an event</h4>
                            <EventSelect title={item.name} changeItem={setValues} idx={idx}/>
                        </div>
                    )
                })}
            </Modal>
        )
    }

    let CardModal = (props) => (
    // <Modal
    //     size="lg"
    //     aria-labelledby="contained-modal-title-vcenter"
    //     centered
    //     show={modalShown}
    //     onHide={() => setModalShown(false)}
    //   >
    //     <Modal.Header closeButton style={{alignItems: "center"}}>
    //         <div style={{display : "flex", justifyContent : "space-between", width : "100vw"}}>
    //             <Modal.Title id="contained-modal-title-vcenter">
    //                 {getPastDay(length.length - idx - 1)}
    //             </Modal.Title>
    //             {editable ? <Button onClick={() => {setEditable(false); setModalShown(false)}}>Save Changes</Button> : <Button onClick={() => setEditable(true)}>Edit</Button>}
    //         </div>
    //     </Modal.Header>
    //     <Modal.Body>
    //         <ModalBody day={idx} hide={() => { setModalShown(false) }} editable={editable} context={context}/>
    //     </Modal.Body>
    //   </Modal>
    <div className='border-2 log-card' style={{marginLeft : "5%", backgroundColor:"white", width: "90%"}}>
        <Modal.Header style={{alignItems: "center", padding: "0 0 20px 0"}}>
            <div style={{display : "flex", justifyContent : "space-between", width : "100vw", alignItems:'center'}}>
                <Modal.Title id="contained-modal-title-vcenter">
                    {getPastDay(length.length - idx - 1)}
                </Modal.Title>
                {/* <div>
                    {editable ? <Button onClick={() => {setEditable(false)}} variant='success'>Save Changes</Button> : <Button onClick={() => setEditable(true)}>Edit</Button>}
                    <Icons.FaRegWindowClose onClick={() => {setModalShown(false)}} style={{marginLeft: "20px"}}/>
                </div> */}
                <Icons.FaRegWindowClose onClick={() => {setModalShown(false)}} style={{marginLeft: "20px"}}/>
            </div>
        </Modal.Header>
        <div style={{paddingTop : "20px"}}>
            <PopUpBody day={idx} hide={() => { setModalShown(false) }} editable={editable} context={context} eventObject={tempEvents} updateEvents={() => updateEvents} events={events}/>
        </div>
    </div>
    )

    let DayCard = (props) => <div className="border-2 log-card">
    <div className="subheader">
        <Card.Title>{getPastDay(length.length - props.day - 1)}</Card.Title>
        <div onClick={() => {openModal(props.day)}}>
            <Icons.FaExpandAlt className="hover"/>
        </div>
    </div>
    <Card.Text>
        Day {props.day}
    </Card.Text>
    <hr className="triggers-hr" style={{width: "100%"}}/>
    {items.map((item, index) => {
        if(index < 3){
            let data = Object.values(item.data)
            //day # and order of data stored is inversed
            let dataIdx = length.length - props.day - 1
            if(!isNaN(data[dataIdx])){
                if(typeof(data[dataIdx]) === "boolean"){
                    return <div key={index}>
                    <input type="checkbox" id="box" checked={data[dataIdx]} readOnly/>
                    <label for="box" style={{paddingLeft: "10px"}}>{item.name}</label>
                    <hr></hr>
                    </div>
                }
                else if(typeof(data[dataIdx]) === "number"){
                    return <div key={index}>
                    <div style={{display: "flex", justifyContent: "space-between"}}>
                    <p style={{marginBottom: "0px"}}>{item.name}</p>
                    <p style={{marginBottom: "0px"}}>{data[dataIdx]}</p>
                    </div>
                    <hr></hr>
                    </div>
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
        {!modalShown && <EventSelectModal />}
        {modalShown && <CardModal />}
        <div className="log-formatter">
        {!modalShown && length.reverse().map(item => {
            return <>
            {item !== 0 ? <DayCard day={item}/> : null}
            </>
        })}
        </div>
    </div>
    </>
}

export {DisplayEntries}