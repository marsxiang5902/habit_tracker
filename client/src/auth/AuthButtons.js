'use strict'

import React from 'react';
import { sessionContext } from './sessionContext'
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class AuthButtons extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.context && this.context.isAuthed) {
            return (
                <div>
                    <Button onClick={this.props.handleLogout} style={{marginRight: "5px"}}><Link style={{color:'white'}}>Logout</Link></Button>
                    <p>{this.context.user}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <Button style={{marginRight: "5px"}}><Link to="/login" style={{color:'white'}}>Login</Link></Button>
                    <Button style={{marginRight: "5px"}}><Link to="/signup" style={{color:'white'}}>Signup</Link></Button>
                </div>
            )
        }
    }
}
AuthButtons.contextType = sessionContext
export default AuthButtons