import React, { useState, useContext } from "react"
import { appContext } from "../context/appContext"
import { Modal, OverlayTrigger, Popover, Dropdown, DropdownButton, Button } from "react-bootstrap"
import * as Icons from "react-icons/fa";
import { getEventById } from "../lib/locateEvents";
import { updateEvent } from "../services/eventServices";

let PreviewPopover = React.forwardRef((props, ref) => {
    let context = useContext(appContext)
    let record = props.record

    return <Popover {...props} ref={ref} id="popover-basic">
        <Popover.Title as="h3">{"Events in Stack"}</Popover.Title>
        <Popover.Content>
            {record.eventList.map(_id => (
                <p key={_id}>
                    {getEventById(context, _id).name}
                </p>
            ))}
        </Popover.Content>
    </Popover>
})

function ModalBody(props) {
    const context = useContext(appContext)
    const [ar, setAr] = useState(props.record.eventList)
    const [newElem, setNewElem] = useState(null)

    const noItem = { _id: null, name: "New Event" }
    let dropdownContents = { null: noItem }
    for (let type in context.timedEvents) {
        if (type === 'todo' || type === 'stack') {
            continue;
        }
        for (let _id in context.timedEvents[type]) {
            dropdownContents[_id] = context.timedEvents[type][_id]
        }
    }

    return <>
        <p>
            Add a list of events that will be shown in the dashboard instead of this stack.
        </p>
        {ar.map((_id, idx) => (
            <div className="card-2" key={_id}>
                <div className="pushed" key={_id}>
                    <div className="stacked">
                        <Icons.FaArrowUp onClick={() => {
                            if (idx > 0) {
                                let tmp = [...ar], val = tmp[idx]
                                tmp[idx] = tmp[idx - 1]
                                tmp[idx - 1] = val
                                setAr(tmp)
                            }
                        }} className="hover" />
                        <Icons.FaArrowDown onClick={() => {
                            if (idx < ar.length - 1) {
                                let tmp = [...ar], val = tmp[idx]
                                tmp[idx] = tmp[idx + 1]
                                tmp[idx + 1] = val
                                setAr(tmp)
                            }
                        }} className="hover" />
                    </div>
                    <div className="pushed-spaced">
                        <p>{getEventById(context, _id).name}</p>
                    </div>
                </div>
                <Icons.FaTrash className="hover" onClick={() => {
                    setAr([...ar.slice(0, idx), ...ar.slice(idx + 1, ar.length)])
                }} />
            </div>
        ))}
        <div className="pushed">
            <DropdownButton variant="light" title={dropdownContents[newElem].name}>
                {Object.keys(dropdownContents).map(_id => (
                    <Dropdown.Item key={_id} onClick={() => { setNewElem(_id) }}>{dropdownContents[_id].name}</Dropdown.Item>
                ))}
            </DropdownButton>
            <Button onClick={() => {
                if (newElem !== null) {
                    setAr([...ar, newElem])
                    setNewElem(null)
                }
            }}>Add</Button>
        </div>
        <Button className="button" variant="success" onClick={async () => {
            context.setContext(await updateEvent(context, props.record, { eventList: ar }))
            props.hide()
        }}>Submit</Button>
    </>
}

function Stack(props) {
    let [modalShown, setModalShown] = useState(false)
    let record = props.record
    let modalBody = modalShown && <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={modalShown}
        onHide={() => setModalShown(false)}
    >
        <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
                Edit {record.name}
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <ModalBody record={props.record} hide={() => { setModalShown(false) }} />
        </Modal.Body>
    </Modal>
    return <>
        {modalBody}
        <div className="card-2 border-2">
            <div className="habit habit-2 inline">
                <h4 className="habit no-padding-top">{record.name}</h4>
            </div>
            <div>
                <OverlayTrigger
                    placement="left"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<PreviewPopover record={record} />}>
                    <Icons.FaPencilAlt
                        className="hover"
                        style={{ marginRight: '20px' }}
                        onClick={() => { setModalShown(true) }} />
                </OverlayTrigger>
            </div>
        </div>
    </>
}

export default function StackList(props) {
    const context = useContext(appContext)
    let records = context.timedEvents.stack
    return <>
        <div class="fullheader">
            <h2>Stacks</h2>
        </div>
        {records && Object.keys(records).map(_id =>
            <Stack record={records[_id]} key={_id} />
        )}
    </>
}