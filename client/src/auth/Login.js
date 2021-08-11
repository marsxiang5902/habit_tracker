import React from 'react';
import makeRequest from '../api/makeRequest';
import '../static/page.css'
import Layout from '../components/layout';
import { Button } from 'react-bootstrap';


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
            <label className="page-form"> {label}
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
        let loginResult = await makeRequest('/login', 'post', {
            user: this.state.user, password: this.state.password
        })
        if (!loginResult.error) {
            this.props.handleLogin(loginResult.data.jwt)
        } else {
            this.setState({ loginFailed: true })
        }
    }

    render() {
        return (
            <>
                <Layout name="THE LOGIN"></Layout>
                <div className="dashboard">
                    {this.state.loginFailed && <p>Login failed.</p>}
                    <form onSubmit={this.handleSubmit} style={{ marginRight: "10%" }}>
                        {this.inputPart("Username", "user", "text")}
                        {this.inputPart("Password", "password", "password")}
                        {/* <input type="submit" value="Log in" /> */}
                        <Button variant="primary" type="submit" value="Log in">Log In</Button>
                    </form>
                </div>
            </>
        )
    }
}