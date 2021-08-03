import React, { useState, useEffect, useContext } from "react";
import '../static/page.css'
import { Form } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataList from '../components/data-list'
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
                    <DataList data={habits} context={context} setContext={props.setContext} title="Daily Habits" type="Habit" />
                </div>
                <div className="container" id="todos">
                    <DataList data={todos} context={context} setContext={props.setContext} title="Todos" type="Todo" />
                </div>
            </div>
        </>
    );
}

export default All;