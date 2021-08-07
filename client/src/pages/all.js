import React from "react";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from '../components/EventList'
import Layout from "../components/layout";

function All(props) {
    return (
        <>
            <Layout name="🗺 THE PLAN" handleLogout={props.handleLogout}>
            </Layout>
            <div className="formatter">
                <div className="container" id="habits">
                    <EventList setContext={props.setContext} title="Daily Habits" type="habit" />
                </div>
                <div className="container" id="todos">
                    <EventList setContext={props.setContext} title="Todos" type="todo" />
                </div>
            </div>
        </>
    );
}

export default All;