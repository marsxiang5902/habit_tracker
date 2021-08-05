import React, { useState, useEffect, useContext } from "react";
import '../static/page.css'
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import EventList from '../components/EventList'
import { appContext } from "../context/appContext";
import Layout from "../components/layout";



function All(props) {
    let context = useContext(appContext)
    let todos = context.timedEvents.todo
    let habits = context.timedEvents.habit

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