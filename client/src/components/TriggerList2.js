import React, { useState } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button, Modal, Card } from 'react-bootstrap'
import '../static/page.css'
import { addData, deleteData, changeData } from '../services/eventServices';
import renderTrigger from '../lib/renderTrigger';
import update from 'immutability-helper'
import { deleteTrigger } from '../services/triggerServices';

//options: Cards, Carousel, Hover on Gallery

function ModalBody(props) {
    const [type, setType] = useState("")
    const [name, setName] = useState("")
    const [trigger, setTrigger] = useState("")
    const [triggerVisible, setTriggerVisible] = useState(false);
    const [imageText, setImageText] = useState("")
    const [bottomImageText, setBottomImageText] = useState("")
    return (
        <>
            <p>
                Triggers are anything that put you in a certain mood or motivate you to do a certain habit. Add your own trigger
                here through a link to music, text, an imager or a youtube video! Make the trigger specific to the habit!
            </p>
            <Form onSubmit={(e) => props.handleSubmit(e, type == "image" && bottomImageText && imageText ?
                `https://api.memegen.link/images/custom/${imageText.replace(" ", "_")}/${bottomImageText.replace(" ", "_")}.png?background=${trigger}` :
                trigger, type, name)}>
                <Form.Group>
                    <select onChange={(e) => setType(e.target.value)}>
                        <option value="" disabled selected>Type of Media</option>
                        <option value="video">Youtube Video</option>
                        <option value="music">Music</option>
                        <option value="image">Image</option>
                        <option value="call">Call to Action</option>
                    </select>
                </Form.Group>
                <Form.Group>
                    <Form.Control className="text-form" type="text" placeholder="Name of Trigger / Call to Action" value={name} onChange={(e) => setName(e.target.value)} />
                    <Form.Control className="text-form" type="text" placeholder="Link to Trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} />
                    {type === "image" ?
                        <>
                            <Form.Control className="text-form" type="text" placeholder="Text to Place on Top of Image" value={imageText} onChange={(e) => setImageText(e.target.value)} />
                            <Form.Control className="text-form" type="text" placeholder="Text to Place on Bottom of Image" value={bottomImageText} onChange={(e) => setBottomImageText(e.target.value)} />
                        </> : null}
                    {triggerVisible && trigger !== "" && type === "image" ? <div className="parent"><img src={`https://api.memegen.link/images/custom/${imageText.replace(" ", "_")}/${bottomImageText.replace(" ", "_")}.png?background=${trigger}`} alt=""></img></div> : null}
                    <Button className="button" variant="primary" type="button" value='preview' onClick={() => setTriggerVisible(!triggerVisible)}>Preview</Button>
                    <Button className="button" variant="success" type="submit" value='change'>Create Trigger</Button>
                </Form.Group>
            </Form>
        </>
    );
}

function Trigger(props) {
    const [previewVisible, setPreviewVisible] = useState(false)
    const [name, setName] = useState(props.item.name)
    const [link, setLink] = useState(props.link)
    const [deleted, setDeleted] = useState(false)
    const [popoverVisible, setPopoverVisible] = useState(false)

    let handleDelete = async (e) => {
        e.preventDefault()
        props.setContext(await deleteTrigger(props.context,))
    }

    let handleSubmit = async (e) => {
        e.preventDefault()
        deleted ? props.setContext(await deleteData(props.context, props.index, 'trigger')) : props.editData({ name: name, link: link }, props.index)
        setDeleted(false)
        setName("")
        setLink("")
        setPopoverVisible(-1)
    }
    const popover = index => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Edit Trigger</Popover.Title>
            <Popover.Content>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group>
                        <Form.Control className="text-form" type="text" placeholder="Trigger Name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Form.Control className="text-form" type="text" placeholder="Resource URL" value={link} onChange={(e) => setLink(e.target.value)} />
                        <Button className="button" variant="success" type="submit" value='change'>Change</Button>
                        <Button className="button" variant="danger" type="submit" value='delete' onClick={(e) => setDeleted(true)}>Delete</Button>
                    </Form.Group>
                </Form>
            </Popover.Content>
        </Popover>
    );
    return (
        <div className="card-2 border-2" key={props.index}>
            <div className="habit habit-2">
                <h5>{props.item.name}</h5>
            </div>
            <div>
                <OverlayTrigger trigger="click" placement="left" overlay={popover(props.index)} show={popoverVisible === props.index ? true : false}>
                    <Icons.FaPencilAlt className="hover" style={{ marginRight: '20px' }} onClick={(e) => { setPopoverVisible(popoverVisible === props.index ? -1 : props.index) }}></Icons.FaPencilAlt>
                </OverlayTrigger>
                <Icons.FaEye className="hover" style={{ marginRight: '20px' }} onClick={(e) => { setPreviewVisible(!previewVisible) }}></Icons.FaEye>
            </div>
            {previewVisible && props.triggerPreview}
        </div>
    )
}

function TriggerList(props) {

    const [modalShow, setModalShow] = useState(-1);
    const [triggerVisible, setTriggerVisible] = useState(false);

    async function handleSubmit(event, trigger, type, name) {
        event.preventDefault();
        let link = `${trigger} ${type} ${props.habit._id}`
        props.setContext(await addData(props.context, name, "trigger", link))
        setModalShow(-1)
    }

    const addModal = () =>
        <Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={true}
            onHide={() => setModalShow(-1)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Add a Trigger
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalBody handleSubmit={handleSubmit} />
            </Modal.Body>
        </Modal>

    return (
        <>
            <div className="subheader triggers-head">
                <h2>{props.habit.name}</h2>
                {modalShow !== props.index ?
                    <Icons.FaRegPlusSquare onClick={() => { setModalShow(props.index) }} className="hover"></Icons.FaRegPlusSquare> :
                    <>
                        <Icons.FaRegWindowClose onClick={() => { setModalShow(-1); setTriggerVisible(false) }} className="hover"></Icons.FaRegWindowClose>
                        {addModal()}
                    </>
                }
            </div>
            <hr className="triggers-hr" />
            <div className="formatter">
                {
                    props.triggers.map((item, index) => {
                        try {
                            if (item.type != 'trigger') return null;
                            const temp = item.resourceURL.split(" ")
                            let triggerItem = { link: temp[0], type: temp[1], habitId: temp[2] }

                            let editData = async (data, index) => {
                                let newData = {}
                                for (let key in data) {
                                    if (key == 'link') {
                                        newData.resourceURL = `${data[key]} ${triggerItem.type} ${triggerItem.habitId}`
                                    } else {
                                        newData[key] = data[key]
                                    }
                                }
                                props.setContext(await changeData(props.context, newData, index, 'trigger'))
                            }
                            if (triggerItem.habitId === props.habit._id) {
                                return <Trigger editData={editData} item={item} link={triggerItem.link} index={index} triggerPreview={renderTriggerResource(item)} context={props.context} setContext={props.setContext} />
                                // return(blank(triggerItem))
                            }
                        } catch (err) { return null; }

                    })}
            </div>

        </>
    )


}

export {
    TriggerList, renderTriggerResource
}