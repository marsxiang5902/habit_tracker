import React, { useState, useContext, useEffect } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import Layout from "../components/layout";
import { Button, Form } from "react-bootstrap";
import { addGroup } from "../services/groupServices";
import makeRequest from "../api/makeRequest";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import GroupPage from "./GroupPage";

function GroupMember(props) {
    return <h5>{props.name}</h5>
}

function GroupCardAddNew(props) {
    let context = useContext(appContext)
    let [adding, setAdding] = useState(false)
    let [name, setName] = useState("")

    async function handleSubmit(e) {
        e.preventDefault();
        if (name !== '')
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
        <Link className="link-black" to={props.link}><h3>{groupRecord.name}</h3></Link>
        <p>{`${Object.keys(groupRecord.members).length} member(s)`}</p>
        <div className="divider" />
        {Object.keys(groupRecord.members).map((name, idx) => idx > 2 ? null : <GroupMember name={name} />)}
    </div>
}

export default function Accountability(props) {
    let context = useContext(appContext)
    let { path, url } = useRouteMatch()
    useEffect(() => {
        (async () => {
            if (Array.isArray(context.session.groups)) {
                let groupsMap = {}
                for (let _id of context.session.groups) {
                    groupsMap[_id] = (await makeRequest(`groups/${_id}`, 'get', {}, context.session.jwt)).data
                }
                props.setGroups(groupsMap)
            }
        })()
    }, [])
    return (
        <div className="wrapper">
            <Layout name="🗺 GROUPS" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu} />
            <div className={props.menu ? "main-content active" : "main-content"}>
                {Array.isArray(context.session.groups) ? null :
                    <Switch>
                        <Route exact path={path}>
                            <div className="dashboard">
                                <div className="groups-grid-container">
                                    {Object.keys(context.session.groups).map(_id => <GroupCard groupRecord={context.session.groups[_id]} link={`${url}/${_id}`} />)}
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
                        </Route>
                        <Route path={`${path}/:groupId`}>
                            <GroupPage back={url} />
                            {/* topic */}
                        </Route>
                    </Switch>
                }
            </div>
        </div>
    );

}