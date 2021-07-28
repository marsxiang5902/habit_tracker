import React from 'react';
import makeRequest from '../api/makeRequest';
import '../static/page.css';
import { Redirect } from "react-router-dom";
import Layout from '../components/layout';

export default class Signup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            email: '',
            password: '',
            signupFailed: false,
        }
    }

    handleEventChange = event => {
        let target = event.target
        this.setState({ [target.name]: target.value })
    }

    inputPart = (label, name, type) => {
        // mini component
        return (
            <label style={{ paddingRight: "5px" }}> {label}
                <input
                    name={name}
                    type={type}
                    value={this.state[name]}
                    onChange={this.handleEventChange}
                    style={{ marginLeft: "5px" }}
                ></input>
            </label>
        )
    }

    handleSubmit = async e => {
        e.preventDefault()
        let signupResult = await makeRequest('/signup', 'post', {
            user: this.state.user, password: this.state.password
        })
        if (signupResult.error) {
            this.setState({ signupFailed: true })
        } else {
            this.props.handleLogin(signupResult.data.jwt)
        }
    }

    render() {
        return (
            <>
                <Layout name="🗺 THE BEGINNING"></Layout>
                <div className="dashboard">
                    {this.state.signupFailed && <p>Signup failed.</p>}
                    <form onSubmit={this.handleSubmit} style={{ marginRight: "7%" }}>
                        {this.inputPart("Username", "user", "text")}
                        {this.inputPart("Email", "email", "text")}
                        {this.inputPart("Password", "password", "password")}
                        <input type="submit" value="Sign up" />
                    </form>
                </div>
            </>
        )
    }
}