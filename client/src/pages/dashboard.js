'use strict'

import React, {useState} from 'react';
import Layout from '../components/layout';

function Dashboard(props) {
    console.log(props.habits)
    const [uncompleted, setUncompleted] = useState([])

    return (
        <Layout name="Home" />

    );
}

export default Dashboard;