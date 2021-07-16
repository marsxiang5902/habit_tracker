'use strict'

import React from 'react';
import makeRequest from '../api/makeRequest';
import { Redirect } from "react-router-dom";

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
            <label> {label}
                <input
                    name={name}
                    type={type}
                    value={this.state[name]}
                    onChange={this.handleEventChange}
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
                {this.state.signupFailed && <p>Signup failed.</p>}
                <form onSubmit={this.handleSubmit}>
                    {this.inputPart("Username", "user", "text")}
                    {this.inputPart("Email", "email", "text")}
                    {this.inputPart("Password", "password", "password")}
                    <input type="submit" value="Sign up" />
                </form>
            </>
        )
    }
}