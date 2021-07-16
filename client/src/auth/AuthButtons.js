'use strict'

import React from 'react';
import { sessionContext } from './sessionContext'
import { Link } from "react-router-dom";

class AuthButtons extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        if (this.context && this.context.isAuthed) {
            return (
                <div>
                    <button onClick={this.props.handleLogout}><Link>Logout</Link></button>
                    <p>{this.context.user}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <button><Link to="/login">Login</Link></button>
                    <button><Link to="/signup">Signup</Link></button>
                </div>
            )
        }
    }
}
AuthButtons.contextType = sessionContext
export default AuthButtons