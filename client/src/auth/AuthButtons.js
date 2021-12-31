import React, { useContext } from 'react';
import { appContext } from '../context/appContext';
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "../static/layout.css";

function AuthButtons(props) {
    let session = useContext(appContext).session
    if (session && session.isAuthed) {
        return (
            <Link className="nav-text"><span onClick={props.handleLogout}>Logout</span></Link>
        )
    } else {
        return (
            <div>
                <Link to="/app/login"><Button variant={props.login ? "outline-primary" : "primary"} style={{ marginRight: "5px" }}>Login</Button></Link>
                <Link to="/app/signup"><Button variant={!props.login ? "outline-primary" : "primary"} style={{ marginRight: "5px" }}>Signup</Button></Link>
            </div>
        )
    }
}
export default AuthButtons