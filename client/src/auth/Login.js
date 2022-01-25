import React from 'react';
import makeRequest from '../api/makeRequest';
import '../static/page.css'
import Layout from '../components/layout';
import Logo from '../static/LogoAsset 3@4x.png'
import { Button, Form } from 'react-bootstrap';
import AuthButtons from './AuthButtons';


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
            <Form.Group className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control name={name} type={type} value={this.state[name]} onChange={this.handleEventChange} />
            </Form.Group>
        )
    }

    handleSubmit = async e => {
        e.preventDefault()
        let loginResult = await makeRequest('/login', 'post', {
            user: this.state.user, password: this.state.password
        })
        if (!loginResult.error) {
            // localStorage.setItem('jwt', loginResult.data.jwt)
            this.props.handleLogin(loginResult.data.jwt)
        } else {
            this.setState({ loginFailed: true })
        }
    }

    async componentDidMount() {
        let jwt = localStorage.getItem('jwt')
        if (jwt != null) {
            let loginResult = await makeRequest('/newDay', 'post', {}, jwt)
            if (!loginResult.error) {
                this.props.handleLogin(loginResult.data.jwt)
            } else {
                localStorage.removeItem('jwt')
            }
        }
    }

    render() {
        return (
            <>
                <div style={{ "display": "flex", "alignItems": "center" }}>
                    <div className="side-logo">
                        <img src={Logo} alt="" style={{ "margin": "0px" }} />
                        <h2 style={{ "color": "white", "fontSize": "2.5em", "fontWeight": "bold", "paddingTop": "10%" }}>Growthify</h2>
                    </div>
                    <div style={{ "flex": "0.75" }}>
                        <div style={{ "position": "absolute", "paddingRight": "5px", "paddingTop": "10px", "right": "5px", "top": '5px' }}>
                            <AuthButtons handleLogout={null} login={true} />
                        </div>
                        <div style={{ "marginLeft": "5%" }}>
                            <div>
                                <h1 style={{ 'paddingBottom': '8px' }}>Login</h1>
                                {this.state.loginFailed && <p>Login failed.</p>}
                                <Form onSubmit={this.handleSubmit} style={{ marginRight: "10%" }}>
                                    {this.inputPart("Username", "user", "text")}
                                    {this.inputPart("Password", "password", "password")}
                                    <Button variant="primary" type="submit" value="Log in">Log In</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}