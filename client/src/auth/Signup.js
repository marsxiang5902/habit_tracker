import React from 'react';
import makeRequest from '../api/makeRequest';
import '../static/page.css';
import Layout from '../components/layout';
import Logo from '../static/LogoAsset 3@4x.png'
import { Button, Form } from 'react-bootstrap';
import AuthButtons from './AuthButtons';

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
            <Form.Group className="mb-3">
                <Form.Label>{label}</Form.Label>
                <Form.Control name={name} type={type} value={this.state[name]} onChange={this.handleEventChange}/>
            </Form.Group>
        )
    }

    handleSubmit = async e => {
        e.preventDefault()
        let signupResult = await makeRequest('/signup', 'post', {
            user: this.state.user, password: this.state.password, email: this.state.email
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
                <div style={{"display":"flex", "alignItems": "center"}}>
                    <div className="side-logo">
                        <img src={Logo} alt="" style={{"maxWidth":"70%", "height": "auto"}}/>
                        <h2 style={{"color": "white", "fontSize": "2.5em", "fontWeight":"bold", "paddingTop":"10%"}}>Growthify</h2>
                    </div>
                    <div style={{"flex": "0.75"}}>
                        <div style={{"position": "absolute", "paddingRight": "5px", "paddingTop": "10px", "right": "5px", "top":'5px'}}>
                            <AuthButtons handleLogout={null} login={true}/>
                        </div>
                        <div style={{"marginLeft": "5%"}}>
                            <div>
                                <h1 style={{'paddingBottom': '8px'}}>Sign Up</h1>
                                {this.state.signupFailed && <p>Signup failed.</p>}
                                <Form onSubmit={this.handleSubmit} style={{ marginRight: "7%" }}>
                                    {this.inputPart("Username", "user", "text")}
                                    {this.inputPart("Email", "email", "text")}
                                    {this.inputPart("Password", "password", "password")}
                                    <Button variant="primary" type="submit" value="Log in">Sign Up</Button>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}