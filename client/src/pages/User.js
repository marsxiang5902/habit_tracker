import React, { useContext, useState } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Layout from "../components/layout";
import { updateUser } from "../services/userServices";

function User(props) {
    let context = useContext(appContext)
    let [dayStartMin, setDayStartMin] = useState(context.session.preferences.dayStartTime % 60)
    let [dayStartHour, setDayStartHour] = useState(Math.floor(context.session.preferences.dayStartTime / 60))
    let [theme, setTheme] = useState(context.session.preferences.theme)
    let [defaultShowSidebar, setDefaultShowSidebar] = useState(context.session.preferences.defaultShowSidebar)
    let [sidebarOrientation, setSidebarOrientation] = useState(context.session.preferences.sidebarOrientation)


    async function handleSubmit(e) {
        e.preventDefault()
        context.setContext(await updateUser(context, { preferences: { dayStartTime: dayStartMin + dayStartHour * 60, theme, defaultShowSidebar, sidebarOrientation } }))
    }

    return (
        <div className="wrapper">
            <Layout name="🗺 THE USER" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu}/>
            <div className="dashboard" style={{"textAlign" : "left"}}>
                <Form onSubmit={handleSubmit}>
                    <h1>User Settings</h1>
                    <Form.Group>
                        <Form.Label>Day Start Time</Form.Label>
                        <Row style={{"marginLeft" : "0px"}}>
                            <Col style={{"paddingLeft" : "0px"}}> 
                                <Form.Control type="number" placeholder="Hour" value={dayStartHour}
                                    onChange={(e) => setDayStartHour(parseInt(e.target.value))} />
                            </Col>
                            <Col sm={0.5}><h3>:</h3></Col>
                            <Col>
                                <Form.Control type="number" placeholder="Minute" value={dayStartMin}
                                    onChange={(e) => setDayStartMin(parseInt(e.target.value))} />
                            </Col>
                        </Row>
                    </Form.Group>

                    {/* <Form.Group>
                        <Form.Label>Theme</Form.Label>
                        <Row>
                            {["light", "dark"].map(opt => <Col key={opt}>
                                <Button variant={`${opt === theme ? "" : "outline-"}primary`} onClick={() => { setTheme(opt) }}>{opt}</Button>
                            </Col>)}
                        </Row>
                    </Form.Group> */}

                    <Form.Group>
                        <Form.Label>Show Sidebar By Default</Form.Label>
                        <Row style={{"marginLeft" : "0px"}}>
                            <Button variant={defaultShowSidebar ? "primary" : "outline-secondary"} onClick={() => { setDefaultShowSidebar(!defaultShowSidebar) }}>Show Sidebar by Default</Button>
                        </Row>
                    </Form.Group>
{/* 
                    <Form.Group>
                        <Form.Label>Partner</Form.Label>
                        <Form.Control type="text" placeholder={context.session.partner || 'None'} readOnly />
                    </Form.Group> */}

                    <Button variant="success" type="submit">
                        Update Settings
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default User;