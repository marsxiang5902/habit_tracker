'use strict'

import React, { useState } from 'react';
import Layout from '../components/layout';

function Dashboard(props) {
    console.log(props.habits[0])
    const [uncompleted, setUncompleted] = useState([])

    return (
        <Layout name="Home" handleLogout={props.handleLogout} />

    );
}

export default Dashboard;