import React from 'react';
import '../static/page.css'
import { TriggerList } from '../components/TriggerList2';
import Layout from '../components/layout';

export default function Triggers(props) {
    return <div className="wrapper">
        <Layout name="🗺 THE TRIGGERS" handleLogout={props.handleLogout}></Layout>
        <TriggerList setContext={props.setContext} type="habit"></TriggerList>
        <TriggerList setContext={props.setContext} type="reward"></TriggerList>
    </div>
}