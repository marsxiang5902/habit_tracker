import React from 'react';
import { appContext } from '../context/appContext';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";

class AuthButtons extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let session = this.context.session
        if (session && session.isAuthed) {
            return (
                <div>
                    <Button onClick={this.props.handleLogout} style={{ marginRight: "5px" }}><Link style={{ color: 'white' }}>Logout</Link></Button>
                    <p>{session.user}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <Button style={{ marginRight: "5px" }}><Link to="/login" style={{ color: 'white' }}>Login</Link></Button>
                    <Button style={{ marginRight: "5px" }}><Link to="/signup" style={{ color: 'white' }}>Signup</Link></Button>
                </div>
            )
        }
    }
}
AuthButtons.contextType = appContext
export default AuthButtons