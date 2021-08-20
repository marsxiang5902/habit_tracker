import React from "react";
import '../static/page.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from '../components/EventList'
import Layout from "../components/layout";

function Editor(props) {
    return (
        <div className="wrapper">
            <Layout name="🗺 THE PLAN" handleLogout={props.handleLogout} />
            <div className="formatter">
                <div className="container" id="habit">
                    <EventList setContext={props.setContext} title="Daily Habits" type="habit" />
                </div>
                <div className="container" id="todo">
                    <EventList setContext={props.setContext} title="Todos" type="todo" />
                </div>
                <div className="container" id="reward">
                    <EventList setContext={props.setContext} title="Rewards" type="reward" />
                </div>
                <div className="container" id="stack">
                    <EventList setContext={props.setContext} title="Stacks" type="stack" />
                </div>
                <div className="container" id="stack">
                    <EventList setContext={props.setContext} title="Forms" type="form" />
                </div>
            </div>
        </div>
    );
}

export default Editor;