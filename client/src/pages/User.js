import React, { useContext, useState } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, Row, Col } from 'react-bootstrap';
import Layout from "../components/layout";
import { updateUser } from "../services/userServices";

function User(props) {
    let context = useContext(appContext)
    let [dayStartMin, setDayStartMin] = useState(context.session.dayStartTime % 60)
    let [dayStartHour, setDayStartHour] = useState(Math.floor(context.session.dayStartTime / 60))

    async function handleSubmit(e) {
        e.preventDefault()
        context.setContext(await updateUser(context, { dayStartTime: dayStartMin + dayStartHour * 60 }))
    }

    return (
        <div className="wrapper">
            <Layout name="🗺 THE USER" handleLogout={props.handleLogout} />
            <div className="dashboard">
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Day Start Time</Form.Label>
                        <Row>
                            <Col>
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
                    <Form.Group>
                        <Form.Label>Partner</Form.Label>
                        <Form.Control type="text" placeholder={context.session.partner || 'None'} readOnly />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default User;