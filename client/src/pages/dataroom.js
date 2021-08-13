import Layout from "../components/layout";
import React, { useContext, useState } from "react";
import { appContext } from "../context/appContext";
import '../static/page.css'
import { Nav } from 'react-bootstrap'
import DisplayOverview from "../components/ProgressOverview";
import { LineChart } from "../components/Chart";

function DataRoom(props){

    let context = useContext(appContext)

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
                <Nav.Link eventKey="2">Calendar</Nav.Link>
            </Nav.Item>
        </Nav>



    if(navPage === "Overview"){
        renderContent = <DisplayOverview context={context}/>
    }
    else if(navPage === "Graphs"){
        renderContent = <LineChart habits={context.timedEvents.habit}></LineChart>
    }
    else{
        navPage = null
    }


    return(
    <>
        <Layout name="📈 THE DATA ROOM" handleLogout={props.handleLogout}></Layout>
        {nav} 
        <div className="padding">
        {renderContent}
        </div>
    </>
    )
}

export default DataRoom