import React, { useContext, useState, useRef } from 'react';
import { appContext } from "../context/appContext";
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button, Modal } from 'react-bootstrap'
import renderTrigger from "../lib/renderTrigger";
import { updateTrigger, deleteTrigger, addTrigger } from "../services/triggerServices";
import { sliceObject } from "../lib/wrapSliceObject";


const UPDATABLE_FIELDS = ['name', 'resourceURL', 'topText', 'bottomText']
class EditPopover extends React.Component {
    constructor(props) {
        super(props)
        this.state = { ...sliceObject(this.props.record, UPDATABLE_FIELDS), test: "3" }
    }
    handleDelete = async (e) => {
        e.preventDefault()
        this.props.setContext(await deleteTrigger(this.context, this.props.record))
    }
    handleSubmit = async (e) => {
        e.preventDefault()
        this.props.setContext(await updateTrigger(this.context, this.props.record, this.state))
        this.props.handleHide()
    }

    render() {
        let renderedFields = {
            'name': 'Name', 'resourceURL': 'Resource URL',
            ...(this.props.record.type === 'image' ? { 'topText': 'Top Text', 'bottomText': 'Bottom Text' } : {})
        }
        return <Popover {...this.props} id="popover-basic">
            <Popover.Title as="h3">Edit Trigger</Popover.Title>
            <Popover.Content>
                <Form onSubmit={(e) => { e.preventDefault() }}>
                    <Form.Group>
                        {Object.keys(renderedFields).map(key => (
                            <Form.Control key={key} className="text-form" type="text" placeholder={renderedFields[key]}
                                value={this.state[key]} onChange={(e) => { this.setState({ [key]: e.target.value }) }} />
                            // HARDCODE: ASSUMED ALL VALUES ARE STRINGS
                        ))}
                        <Button className="button" variant="success" value='change' onClick={this.handleSubmit}>Change</Button>
                        <Button className="button" variant="danger" value='delete' onClick={this.handleDelete}>Delete</Button>
                    </Form.Group>
                </Form>
            </Popover.Content>
        </Popover>
    }
}
EditPopover.contextType = appContext

function Trigger(props) {
    const [popoverShown, setPopoverShown] = useState(false)
    const [previewShown, setPreviewShown] = useState(false)
    const ref = useRef(null)

    let record = props.record

    let name = <div className="habit habit-2">
        <h5>{record.name}</h5>
    </div>

    let overlay = <div ref={ref}>
        <OverlayTrigger trigger="click" placement="left"
            overlay={
                <EditPopover
                    record={record}
                    setContext={props.setContext}
                    handleHide={() => { setPopoverShown(false) }} />}
            show={popoverShown}
            container={ref.current}
        >
            <Icons.FaPencilAlt className="hover" style={{ marginRight: '20px' }}
                onClick={() => { setPopoverShown(!popoverShown) }} />
        </OverlayTrigger>
        <Icons.FaEye className="hover" style={{ marginRight: '20px' }}
            onClick={() => { setPreviewShown(!previewShown) }}></Icons.FaEye>
    </div >

    return <div className="card-2 border-2 trigger-list">
        {name}
        {overlay}
        {previewShown && renderTrigger(record)}
    </div>
}

function AddTriggerBody(props) {
    const context = useContext(appContext)
    const [name, setName] = useState('')
    const [type, setType] = useState('')
    const [resourceURL, setResourceURL] = useState('')
    const [topText, setTopText] = useState('')
    const [bottomText, setBottomText] = useState('')
    const [previewShown, setPreviewShown] = useState(false)

    let option = (val, change, placeholder) => (
        <Form.Control className="text-form" type="text" placeholder={placeholder} value={val} onChange={(e) => change(e.target.value)} />
    )

    return <>
        <div className="card-2 border-2 trigger-list">
            <div className="form-padding">
                <h4>Add a Trigger</h4>
                <p>
                    Triggers are anything that put you in a certain mood or motivate you to do a certain habit. Add your own trigger
                    here through a link to music, text, an image or a youtube video! Make the trigger specific to the habit!
                </p>
                <Form onSubmit={async (e) => {
                    e.preventDefault()
                    if (type !== '') {
                        props.setContext(await addTrigger(context, name, type, props.event_id, { resourceURL, topText, bottomText }))
                    }
                    setName(''); setType(''); setResourceURL(''); setTopText(''); setBottomText(''); setPreviewShown(false);
                    props.hide();
                }}>
                    <Form.Group>
                        <select onChange={(e) => setType(e.target.value)}>
                            <option value="" disabled selected>Type of Trigger</option>
                            <option value="video">Video</option>
                            <option value="audio">Audio</option>
                            <option value="image">Image</option>
                            <option value="link">Link</option>
                        </select>
                    </Form.Group>
                    <Form.Group>
                        {option(name, setName, "Name of Trigger")}
                        {option(resourceURL, setResourceURL, "Link to Trigger")}
                        {type === "image" && <>
                            {option(topText, setTopText, "Text to Place on Top of Image")}
                            {option(bottomText, setBottomText, "Text to Place on the Bottom of Image")}
                        </>}
                        {previewShown && type !== "" && renderTrigger({
                            name, type, resourceURL, topText, bottomText
                        })
                        }
                        <Button className="button" variant="primary" type="button" value='preview' onClick={() => setPreviewShown(!previewShown)}>Preview</Button>
                        <Button className="button" variant="success" type="submit" value='change'>Create Trigger</Button>
                        <Button className="button" variant="danger" type="button" value='change' onClick={() => props.hide()}>Cancel</Button>
                    </Form.Group>
                </Form>
            </div>
        </div>
    </>
}

function Event(props) {
    const [modalShown, setModalShown] = useState(false)

    let head = <div className="subheader">
        <h4>Edit Triggers</h4>
        {modalShown ?
            <Icons.FaRegWindowClose onClick={() => { setModalShown(false) }} className="hover"></Icons.FaRegWindowClose> :
            <Icons.FaRegPlusSquare onClick={() => { setModalShown(true) }} className="hover"></Icons.FaRegPlusSquare>
        }
    </div>
    let hr = <hr className="triggers-hr" />
    let triggers = <div>
        {Object.keys(props.record.triggers).map(_id =>
            <Trigger key={_id} record={props.record.triggers[_id]} setContext={props.setContext} />
        )}
    </div>

    // let modalBody = modalShown && <Modal
    //     size="lg"
    //     aria-labelledby="contained-modal-title-vcenter"
    //     centered
    //     show={modalShown}
    //     onHide={() => setModalShown(false)}
    // >
    //     <Modal.Header closeButton>
    //         <Modal.Title id="contained-modal-title-vcenter">
    //             Add a Trigger
    //         </Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>
    //         <AddTriggerBody setContext={props.setContext} event_id={props.record._id} hide={() => { setModalShown(false) }} />
    //     </Modal.Body>
    // </Modal>
    let modalBody = modalShown && <AddTriggerBody setContext={props.setContext} event_id={props.record._id} hide={() => { setModalShown(false) }} />

    return <>
        {hr}
        {head}
        {triggers}
        {modalBody}
    </>
}

function TriggerList(props) {
    const context = useContext(appContext)

    let records = context.timedEvents[props.type]
    return Object.keys(records).map(_id =>
        <Event setContext={props.setContext} record={records[_id]} key={_id} />
    )
}

export { Event, TriggerList }