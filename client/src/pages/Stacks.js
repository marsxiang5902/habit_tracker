import React from 'react';
import '../static/page.css'
import Layout from '../components/layout';
import { StackList } from '../components/StackList'

export default function Stacks(props) {
    return <div className="wrapper">
        <Layout name="🗺 THE STACKING" handleLogout={props.handleLogout}></Layout>
        <div className="container">
            <StackList />
        </div>
    </div>
}