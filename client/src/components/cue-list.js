'use strict'

import React, { useState } from 'react';
import * as Icons from "react-icons/fa";
import {Form, Popover, OverlayTrigger, Button, Modal, Card} from 'react-bootstrap'
import { Select } from 'evergreen-ui';

//options: Cards, Carousel, Hover on Gallery

function CuesList(props) {

    const [formVisible, setFormVisible] = useState(-1)
    const [cue, setCue] = useState("")
    const [name, setName] = useState("")
    const [popoverVisible, setPopoverVisible] = useState(-1)
    const [del, setDelete] = useState(false)
    const [modalShow, setModalShow] = useState(-1);
    const [cueVisible, setCueVisible] = useState(false);
    const [type, setType] = useState("")

    function handleEdit(event) {
        event.preventDefault();
        props.changeData(cue, popoverVisible, del, props.type)
        setDelete(false)
        setPopoverVisible(-1)
        setCue("")
    }

    function handleSubmit(event) {
        event.preventDefault();
        let link = `${cue} ${type} ${props.habit._id}`
        console.log(link)
        props.addData(name, "cue", link)
        setModalShow(-1)
        setCue("")
        setType("")
    }

    const popover = (index) => (
        <Popover id="popover-basic">
            <Popover.Title as="h3">Edit {props.type}</Popover.Title>
            <Popover.Content>
                <Form onSubmit={(e) => handleEdit(e, index, false)}>
                <Form.Group>
                    <Form.Control type="text" placeholder={`${props.type} Name`} value={cue} onChange={(e) => setCue(e.target.value)}/>
                    <Button className="button" variant="success" type="submit" value='change'>Change</Button>
                    <Button className="button" variant="danger" type="submit" value='delete' onClick={(e) => setDelete(true)}>Delete</Button>
                </Form.Group>
                </Form>
            </Popover.Content>
        </Popover>
    );

    const AddModal = () => {
        return (
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
                <p>
                    Cues are anything that put you in a certain mood or motivate you to do a certain habit. Add your own cue
                    here through a link to music, text, an imager or a youtube video! Make the cue specific to the habit!
                </p>
                <Form onSubmit={(e) => handleSubmit(e)}>
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
                        <Form.Control type="text" placeholder="Name of Cue" value={name} onChange={(e) => setName(e.target.value)}/>
                        <Form.Control type="text" placeholder="Link to Cue" value={cue} onChange={(e) => setCue(e.target.value)}/>
                        {cueVisible && cue !== "" && type==="image" ? <div className="parent"><img src={cue} alt=""></img></div>:null}
                        <Button className="button" variant="primary" type="button" value='preview' onClick={setCueVisible(true)}>Preview</Button>
                        <Button className="button" variant="success" type="submit" value='change'>Create Cue</Button>
                    </Form.Group>
                </Form>
            </Modal.Body>
          </Modal>
        );
    }

    const blank = (item) => {
        return(
            <div className="parent blank">
                <a href={item.resourceUrl}><h3 style={{color:"white"}}>Link to {item.name}</h3></a>
            </div>
        )
    }

    const video = (item) => {
        if(item.link.includes('youtube')){
            let request = item.link;
            if (!request.includes('embed')){
                request = `https://youtube.com/embed/${request.replace('https://www.youtube.com/watch?v=', '')}?theme=0`;
            }
            return(
                <div className="parent">
                    <iframe width="150%" height="300" src={request} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>            
                </div>
            )
        }
        return(
            <div className="parent">
                <iframe width="150%" height="300" src={item.link} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>            
            </div>
        )
    }

    const music = (item) => {
        if(item.link.includes('spotify')){
            let request;
            if (!item.link.includes('embed')){
                request = `https://open.spotify.com/embed/track/${item.link.replace('https://open.spotify.com/track/', '')}?theme=0`;
            }
            return(
                <div className="parent">
                    <iframe src={request} width="100%" height="80" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="spotify"></iframe>
                </div>
            )
        }
        if(item.link.includes('w.soundcloud')){
            return(
                <div className="parent">
                    <iframe src={item.link} width="100%" height="200" frameBorder="0" allowtransparency="true" allow="encrypted-media" title="spotify"></iframe>
                </div>
            )
        }
        return(
            blank(item)
        )
    }

    const image = (item) => {
        return(
            <div className="parent">
                <img src={item.link} alt=""></img>
            </div>
        )
    }

    //spotify structure: https://open.spotify.com/embed/track/2zQl59dZMzwhrmeSBEgiXY
    //url: https://open.spotify.com/track/2zQl59dZMzwhrmeSBEgiXY
    //soundcloud: https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/662143949&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true
    //url: https://soundcloud.com/seratostudio/doms-demise?in=seratostudio/sets/concert-hall-vol-1


    return(
        <>
            <div className="subheader cues-head">
            <h2>{props.habit.name}</h2>
            {modalShow !== props.index ?
                <Icons.FaRegPlusSquare onClick={() => { setModalShow(props.index) }} className="hover"></Icons.FaRegPlusSquare> :
                <>
                <Icons.FaRegWindowClose onClick={() => { setModalShow(-1); setCueVisible(false)}} className="hover"></Icons.FaRegWindowClose>
                <AddModal/>
                </>
                }
            </div>
            <hr className="cues-hr"/>
            <div className="formatter">
            {props.cues.map((item, index) => {
                const temp = item.resourceURL.split(" ")
                let cueItem = {link: temp[0], type: temp[1], habitId: temp[2]}
                console.log(cueItem)
                if(cueItem.habitId === props.habit._id){
                    if (cueItem.type === "music"){
                        return(
                            music(cueItem)
                        )
                    }
                    if (cueItem.type === "image"){
                        return(
                            image(cueItem)
                        )
                    }
                    if (cueItem.type === "video"){
                        return(
                            video(cueItem)
                        )
                    }
                    // return(blank(cueItem))
                }

            })}
            </div>
            
        </>
    )


}

export default CuesList;
