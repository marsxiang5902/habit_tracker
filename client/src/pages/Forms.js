import React from 'react';
import '../static/page.css'
import Layout from '../components/layout';
import FormList from '../components/FormList'

export default function Stacks(props) {
    return <div className="wrapper">
        <Layout name="🗺 THE DATA COLLECTION" handleLogout={props.handleLogout}></Layout>
        <div className="container">
            <FormList />
        </div>
    </div>
}