import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import '../stylesheets/styles.css'
import axios from 'axios'


export default class Logins extends Component {
    constructor(props){
        super(props);
    }
    state={
        signin:false,
        fullname:"",
        email:"",
        username:"",
        password:"",
        reennter:"",   
    }

    updateInfo=({target})=>{
        this.setState({
            ...this.state,
            [target.id]:target.value
        })
    }

    switch=()=>{
        this.setState({
            signin:!this.state.signin,
            fullname:"",email:"",username:"",password:"",reenter:""
        })
    }

    submit=()=>{
        if(!this.state.signin){
            console.log(this.state.password);
            axios.post(process.env.REACT_APP_BACKEND+'/signin',{
                username:this.state.username.trim(),
                password:this.state.password.trim()
            }).then((data)=>{
                //console.log(data.headers);
                this.props.setToken(data.headers["x-auth"]);
                alert(data.data.message)
            })
        }else{
            axios.post(process.env.REACT_APP_BACKEND+'/userForm',{
                username:this.state.username,
                password:this.state.password,
                name:this.state.fullname,
                email:this.state.email,

            }).then((data)=>{
                console.log(data);
            })
        }

    }

    render() {
        return (
            <div className="inup">
            <div className="signupForm" hidden={!this.state.signin}>
                <h2>Sign Up</h2><br/>
                <Form.Group>
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter your full name" id='fullname' 
                    value={this.state.fullname} 
                    onChange={this.updateInfo} />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="Enter proper format of email" id='email' 
                    value={this.state.email}
                    onChange={this.updateInfo}/>
                    <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter your username" id='username' 
                    value={this.state.username}
                    onChange={this.updateInfo}/>
                    <Form.Text className="text-muted">
                    Username should be atleast 6 characters long
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter password" id='password' 
                    value={this.state.password}
                    onChange={this.updateInfo}/>
                    <Form.Text className="text-muted">
                    Password is end-to-end encrypted
                    </Form.Text>
                </Form.Group> 

                <Form.Group>
                    <Form.Label>Re-enter Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter same password" id='reenter' 
                    value={this.state.reenter}
                    onChange={this.updateInfo}/>
                </Form.Group> 

                <Button variant="primary" onClick={this.submit}>Signup</Button><br/>
                <small className="switch" onClick={this.switch}>Already have an account ? <span>Sign In</span></small>
            </div>

            <div className="signupForm" hidden={this.state.signin}>
                <h2>Sign In</h2><br/>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter your registered username" id='username' 
                    value={this.state.username}
                    onChange={this.updateInfo}/>
                    <Form.Text className="text-muted">
                    Username should be atleast 6 characters long
                    </Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" id='password' 
                    value={this.state.password}
                    onChange={this.updateInfo}/>
                </Form.Group> 

                <Button variant="primary" onClick={this.submit}>SignIn</Button><br/>
                <small className="switch" onClick={this.switch}>New to use Task Manager ? <span>Sign Up</span></small>
            </div>
            </div>
        )
    }
}
