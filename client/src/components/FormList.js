import React, { useState, useContext } from "react"
import { appContext } from "../context/appContext"
import { Modal, OverlayTrigger, Popover, Dropdown, DropdownButton, Button, Form } from "react-bootstrap"
import * as Icons from "react-icons/fa";
import { updateEventFormLayout } from "../services/eventServices";

let PreviewPopover = React.forwardRef((props, ref) => {
    let record = props.record

    return <Popover {...props} ref={ref} id="popover-basic">
        <Popover.Title as="h3">Questions in Form</Popover.Title>
        <Popover.Content>
            {record.formLayout.map(formField => (
                <p key={formField[0]}>
                    {`${formField[1]}: ${formField[0]}`}
                </p>
            ))}
        </Popover.Content>
    </Popover>
})

function ModalBody(props) {
    const context = useContext(appContext)
    const [perm, setPerm] = useState(props.record.formLayout.map(formField => [formField[0], true, formField[0]]))
    const [newFieldType, setnewFieldType] = useState('num')
    const [newFieldName, setnewFieldName] = useState('')
    const [submitFailed, setSubmitFailed] = useState(false)

    const TYPES = { 'num': 'Number', 'str': 'Text' }

    return <>
        <p>
            Add a list of fields that will be shown in the dashboard when this form is shown.
        </p>
        {submitFailed && <p>
            Submit failed. Field names must be unique.
        </p>}
        <div className="border-2">
        {perm.map((field, idx) => (
            <div className="card-2 border-2" key={perm[idx][1] ? perm[idx][2] : idx} style={{padding: "10px", alignItems : "center"}}>
                <div className="pushed">
                    <div className="stacked-free">
                        {/* reorder */}
                        <Icons.FaArrowUp onClick={() => {
                            if (idx > 0) {
                                let tmp = [...perm], val = tmp[idx]
                                tmp[idx] = tmp[idx - 1]
                                tmp[idx - 1] = val
                                setPerm(tmp)
                            }
                        }} className="hover" />
                        <Icons.FaArrowDown onClick={() => {
                            if (idx < perm.length - 1) {
                                let tmp = [...perm], val = tmp[idx]
                                tmp[idx] = tmp[idx + 1]
                                tmp[idx + 1] = val
                                setPerm(tmp)
                            }
                        }} className="hover" />
                    </div>
                    <div className="pushed-spaced">
                        {/* display */}
                        <Form.Group className="mb-3" controlId="editName">
                            {/* <Form.Label>{perm[idx][1] ? perm[idx][2] + " new label" : 'New field'}</Form.Label> */}
                            <Form.Label>Edit Field</Form.Label>
                            <Form.Control type="text" placeholder="Field Name" value={perm[idx][0]} onChange={e => {
                                // rename
                                setPerm([...perm.slice(0, idx), [e.target.value, perm[idx][1], perm[idx][2]], ...perm.slice(idx + 1, perm.length)])
                            }} />
                        </Form.Group>
                    </div>
                </div>
                <Icons.FaTrash className="hover" onClick={() => {
                    //delete
                    setPerm([...perm.slice(0, idx), ...perm.slice(idx + 1, perm.length)])
                }} />
            </div>
        ))}
        </div>
        <Form.Group className="mb-3" controlId="newFieldName">
            <Form.Label>New Field Name</Form.Label>
            <div className="pushed">
                <div className="pushed">
                    <DropdownButton variant="light" title={TYPES[newFieldType]}>
                        {Object.keys(TYPES).map(type => (
                            <Dropdown.Item key={type} onClick={() => { setnewFieldType(type) }}>{TYPES[type]}</Dropdown.Item>
                        ))}
                    </DropdownButton>
                    <Form.Control className="pushed-spaced" type="text" placeholder="New Field Name" value={newFieldName} onChange={e => {
                        setnewFieldName(e.target.value)
                    }} />
                </div>
                <Button className="pushed-spaced" onClick={() => {
                    //add
                    setPerm([...perm, [newFieldName, false, newFieldType]])
                    setnewFieldName('')
                    setnewFieldType('num')
                }}>Add</Button>
            </div>
        </Form.Group>
        <Button className="button" variant="success" onClick={async () => {
            //submit
            if ((new Set(perm.map(ar => ar[0]))).size < perm.length) {
                setSubmitFailed(true)
            } else {
                context.setContext(await updateEventFormLayout(context, props.record, perm))
                props.hide()
            }
        }}>Submit</Button>
    </>
}

function EditForm(props) {
    let modalBody = 
        <div className="form-padding">
        <ModalBody record={props.record} hide={() => {props.hide()}}/>
        </div>

    return <>
        <hr className="triggers-hr" />
        <h4>Edit Form</h4>
        {/* <div className="card-2 border-2 trigger-list">
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
        </div> */}
        {modalBody}
    </>
}

function FormList(props) {
    const context = useContext(appContext)
    let records = context.timedEvents.form
    return <>
        <div class="fullheader">
            <h2>Forms</h2>
        </div>
        {records && Object.keys(records).map(_id =>
            <EditForm record={records[_id]} key={_id} />
        )}
    </>
}

export {FormList, EditForm}