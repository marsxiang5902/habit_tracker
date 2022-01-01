import Layout from "../components/layout";
import React, { useContext, useState } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import { Nav } from 'react-bootstrap'
import DisplayOverview from "../components/ProgressOverview";
import { LineChart } from "../components/Chart";
import { Calendar } from "../components/Calendar";
import { getAllEvents, getSomeEvents } from "../lib/locateEvents";
import { DisplayEntries } from "../components/Log";

function DataRoom(props) {

    let context = useContext(appContext)
    let events = getSomeEvents(context, ['habit', 'form'])

    let navOptions = ['Overview', 'Graphs', 'Calendar']

    let [navPage, setNavPage] = useState('Overview')
    let renderContent = <DisplayOverview />

    const handleSelect = (eventKey) => setNavPage(navOptions[eventKey]);

    let nav =
        <Nav fill variant="pills" defaultActiveKey="0" className="sub-nav" onSelect={handleSelect}>
            <Nav.Item>
                <Nav.Link eventKey="0">Overview</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="1">Graphs</Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link eventKey="2">Log</Nav.Link>
            </Nav.Item>
        </Nav>



    if (navPage === "Overview") {
        renderContent = <DisplayOverview context={context} />
    }
    else if (navPage === "Graphs") {
        renderContent = <LineChart habits={context.timedEvents.habit} forms={context.timedEvents.form} events={events}></LineChart>
    }
    else{
        renderContent = <DisplayEntries context={context} />
    }

    if (!context.session.isAuthed) {
        return null
    }


    return (
        <div className="wrapper">
            <Layout name="📈 THE DATA ROOM" handleLogout={props.handleLogout} menu={props.menu} showMenu={props.showMenu}></Layout>
            <div className={props.menu ? "main-content active" : "main-content"}>
                <div style={{"marginTop": "1%"}}>
                    {nav}
                </div>
                <div className="padding">
                    {renderContent}
                </div>
            </div>
        </div>
    )
}

export default DataRoom