import React from 'react';
import '../static/page.css'
import TriggerList from '../components/TriggerList';
import Layout from '../components/layout';

export default function Triggers(props) {
    return <>
        <Layout name="🗺 THE TRIGGERS" handleLogout={props.handleLogout}></Layout>
        <TriggerList setContext={props.setContext} type="habit"></TriggerList>
    </>
}