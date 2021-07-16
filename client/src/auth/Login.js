'use strict'

import React from 'react';
import makeRequest from '../api/makeRequest';

export default class Login extends React.Component {
    // if we have to write another one, generalize
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            password: '',
            loginFailed: false,
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
        try {
            let loginResult = await makeRequest('/login', 'post', {
                user: this.state.user, password: this.state.password
            })
            this.props.handleLogin(loginResult.data.jwt)
        }
        catch (err) {
            this.setState({ loginFailed: true })
        }
    }

    render() {
        return (
            <>
                {this.state.loginFailed && <p>Login failed.</p>}
                <form onSubmit={this.handleSubmit}>
                    {this.inputPart("Username", "user", "text")}
                    {this.inputPart("Password", "password", "password")}
                    <input type="submit" value="Log in" />
                </form>
            </>
        )
    }
}