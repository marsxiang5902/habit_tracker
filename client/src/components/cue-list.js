import React, { useState } from 'react';
import * as Icons from "react-icons/fa";
import { Form, Popover, OverlayTrigger, Button, Modal, Card } from 'react-bootstrap'
import '../static/page.css'
import { addData, deleteData, changeData } from './helperFunctions';

//options: Cards, Carousel, Hover on Gallery

function ModalBody(props) {
    const [type, setType] = useState("")
    const [name, setName] = useState("")
    const [cue, setCue] = useState("")
    const [cueVisible, setCueVisible] = useState(false);
    const [imageText, setImageText] = useState("")
    const [bottomImageText, setBottomImageText] = useState("")
    return (
        <>
            <p>
                Cues are anything that put you in a certain mood or motivate you to do a certain habit. Add your own cue
                here through a link to music, text, an imager or a youtube video! Make the cue specific to the habit!
            </p>
            <Form onSubmit={(e) => props.handleSubmit(e, type == "image" && bottomImageText && topImageText ?
                `https://api.memegen.link/images/custom/${imageText.replace(" ", "_")}/${bottomImageText.replace(" ", "_")}.png?background=${cue}` :
                cue, type, name)}>
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
                    <Form.Control className="text-form" type="text" placeholder="Name of Cue / Call to Action" value={name} onChange={(e) => setName(e.target.value)} />
                    <Form.Control className="text-form" type="text" placeholder="Link to Cue" value={cue} onChange={(e) => setCue(e.target.value)} />
                    {type === "image" ?
                        <>
                            <Form.Control className="text-form" type="text" placeholder="Text to Place on Top of Image" value={imageText} onChange={(e) => setImageText(e.target.value)} />
                            <Form.Control className="text-form" type="text" placeholder="Text to Place on Bottom of Image" value={bottomImageText} onChange={(e) => setBottomImageText(e.target.value)} />
                        </> : null}
                    {cueVisible && cue !== "" && type === "image" ? <div className="parent"><img src={`https://api.memegen.link/images/custom/${imageText.replace(" ", "_")}/${bottomImageText.replace(" ", "_")}.png?background=${cue}`} alt=""></img></div> : null}
                    <Button className="button" variant="primary" type="button" value='preview' onClick={() => setCueVisible(!cueVisible)}>Preview</Button>
                    <Button className="button" variant="success" type="submit" value='change'>Create Cue</Button>
                </Form.Group>
            </Form>
        </>
    );
}

function Cue(props) {
    const [previewVisible, setPreviewVisible] = useState(false)
    const [name, setName] = useState(props.item.name)
    const [link, setLink] = useState(props.link)
    const [deleted, setDeleted] = useState(false)
    const [popoverVisible, setPopoverVisible] = useState(false)

    let handleSubmit = async (e) => {
        e.preventDefault()
        deleted ? props.setContext(await deleteData(props.context, props.index, 'cue')) : props.editData({ name: name, link: link }, props.index)
        setDeleted(false)
        setName("")
        setLink("")
        setPopoverVisible(-1)
    }
    const popover = index => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Edit Cue</Popover.Title>
            <Popover.Content>
                <Form onSubmit={e => handleSubmit(e)}>
                    <Form.Group>
                        <Form.Control className="text-form" type="text" placeholder="Cue Name" value={name} onChange={(e) => setName(e.target.value)} />
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
            {previewVisible && props.cuePreview}
        </div>
    )
}

let blank = (item, name) => {
    return (
        <div className="blank">
            <a href={item.link}><h3 style={{ color: "white" }}>Link to {name}</h3></a>
        </div>
    )
}

let video = (item, name) => {
    if (item.link.includes('youtube')) {
        let request = item.link;
        if (!request.includes('embed')) {
            request = `https://youtube.com/embed/${request.replace('https://www.youtube.com/watch?v=', '')}?theme=0`;
        }
        return (
            <div className="parent">
                <iframe width="100%" height="200" src={request} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
            </div>
        )
    }
    return (
        <div className="parent">
            <iframe width="100%" height="200" src={item.link} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
    )
}

let music = (item, name) => {
    if (item.link.includes('spotify')) {
        let request;
        if (!item.link.includes('embed')) {
            request = `https://open.spotify.com/embed/track/${item.link.replace('https://open.spotify.com/track/', '')}?theme=0`;
        }
        return (
            <div className="parent">
                <iframe src={request} width="100%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="spotify"></iframe>
            </div>
        )
    }
    if (item.link.includes('w.soundcloud')) {
        return (
            <div className="parent">
                <iframe src={item.link} width="100%" height="200" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="spotify"></iframe>
            </div>
        )
    }
    return (
        blank(item, name)
    )
}

let image = (item, name) => {
    return (
        <div className="parent">
            <img src={item.link} alt=""></img>
        </div>
    )
}

let renderCueResource = item => {
    const temp = item.resourceURL.split(" ")
    let cueItem = { link: temp[0], type: temp[1], habitId: temp[2] }

    if (cueItem.type === "music") {
        return music(cueItem, item.name)
    }
    if (cueItem.type === "image") {
        return image(cueItem, item.name)
    }
    if (cueItem.type === "video") {
        return video(cueItem, item.name)
    }
    else {
        return blank(cueItem, item.name)
    }
}

function CuesList(props) {

    const [modalShow, setModalShow] = useState(-1);
    const [cueVisible, setCueVisible] = useState(false);

    async function handleSubmit(event, cue, type, name) {
        event.preventDefault();
        let link = `${cue} ${type} ${props.habit._id}`
        props.setContext(await addData(props.context, name, "cue", link))
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
                    Add a Cue
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ModalBody handleSubmit={handleSubmit} />
            </Modal.Body>
        </Modal>

    return (
        <>
            <div className="subheader cues-head">
                <h2>{props.habit.name}</h2>
                {modalShow !== props.index ?
                    <Icons.FaRegPlusSquare onClick={() => { setModalShow(props.index) }} className="hover"></Icons.FaRegPlusSquare> :
                    <>
                        <Icons.FaRegWindowClose onClick={() => { setModalShow(-1); setCueVisible(false) }} className="hover"></Icons.FaRegWindowClose>
                        {addModal()}
                    </>
                }
            </div>
            <hr className="cues-hr" />
            <div className="formatter">
                {
                    props.cues.map((item, index) => {
                        try {
                            if (item.type != 'cue') return null;
                            const temp = item.resourceURL.split(" ")
                            let cueItem = { link: temp[0], type: temp[1], habitId: temp[2] }

                            let editData = async (data, index) => {
                                let newData = {}
                                for (let key in data) {
                                    if (key == 'link') {
                                        newData.resourceURL = `${data[key]} ${cueItem.type} ${cueItem.habitId}`
                                    } else {
                                        newData[key] = data[key]
                                    }
                                }
                                props.setContext(await changeData(props.context, newData, index, 'cue'))
                            }
                            if (cueItem.habitId === props.habit._id) {
                                return <Cue editData={editData} item={item} link={cueItem.link} index={index} cuePreview={renderCueResource(item)} context={props.context} setContext={props.setContext} />
                                // return(blank(cueItem))
                            }
                        } catch (err) { return null; }

                    })}
            </div>

        </>
    )


}

export {
    CuesList, renderCueResource
}