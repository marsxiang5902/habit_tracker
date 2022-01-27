import React, { useState, useContext } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/layout";
import { Button, Form } from "react-bootstrap";
import { addGroup } from "../services/groupServices";

function GroupMember(props) {
    return <h5>{props.name}</h5>
}

function GroupCardAddNew(props) {
    let context = useContext(appContext)
    let [adding, setAdding] = useState(false)
    let [name, setName] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        props.setContext(await addGroup(context, name))
        setAdding(false)
        setName("")
    }

    return adding ? <div className="groups-item">
        <div className="form-padding">
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>{"Add A New Group"}</Form.Label>
                    <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
                    <Button className="button" variant="success" type="submit" value='add'>Add</Button>
                    <Button className="button" variant="danger" value='cancel' onClick={() => {
                        setName(""); setAdding(false);
                    }}>Cancel</Button>
                </Form.Group>
            </Form>
        </div>
    </div> : <div className="groups-item groups-add"><h2 onClick={() => setAdding(true)}>+ Add Group</h2></div>
}

function GroupCard(props) {
    let groupRecord = props.groupRecord
    return <div className="groups-item">
        <h3>{groupRecord.name}</h3>
        <p>{`${Object.keys(groupRecord.members).length} member(s)`}</p>
        <div className="divider" />
        {Object.keys(groupRecord.members).map((name, idx) => idx > 2 ? null : <GroupMember name={name} />)}
    </div>
}

export default function Accountability(props) {
    let context = useContext(appContext)
    return (
        <div className="wrapper">
            <Layout name="🗺 GROUPS" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu} />
            <div className={props.menu ? "main-content active" : "main-content"}>
                <div className="dashboard">
                    <div className="groups-grid-container">
                        {Object.keys(context.session.groups).map(_id => <GroupCard groupRecord={context.session.groups[_id]} />)}
                        {[...Array(0).keys()].map(v => <GroupCard groupRecord={{
                            "_id": "61f01d8ab15f520016b77012",
                            "user": "test2",
                            "name": "Group 1",
                            "members": {
                                "test2": []
                            },
                            "roles": {
                                "test2": [
                                    "default",
                                    "admin"
                                ]
                            },
                            "invites": []
                        }} />)}
                        <GroupCardAddNew setContext={props.setContext} />
                    </div>
                </div>
            </div>
        </div>
    );

}