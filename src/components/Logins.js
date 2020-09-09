import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import Spinner from '../images/spinner.gif';
import '../stylesheets/styles.css'
import axios from 'axios'


export default class Logins extends Component {
    
    state={
        signin:false,
        fullname:"",
        email:"",
        username:"",
        password:"",
        reenter:"",  
        match:false,
        spinner:false 
    }

    updateInfo=({target})=>{
        this.setState({
            ...this.state,
            [target.id]:target.value,
        },()=>{
            this.setState({
                ...this.state,
                match:(this.state.reenter===this.state.password)    
            })
        })
    }

    switch=()=>{
        this.setState({
            signin:!this.state.signin,
            fullname:"",email:"",username:"",
            password:"",reenter:"",match:false
        })
    }

    submit=()=>{
        this.setState({...this.state,spinner:true});
        var type;
        try{
            var mail=this.state.username,x;
            x=mail.split('@');
            mail=[x[0],...[...x][1].split('.')];
            if(mail.length>2) type="email";
            else throw null;
        }catch(e){
            type="username"
        }
        if(!this.state.signin){
            axios.post(process.env.REACT_APP_BACKEND+'/signin',{
                type,
                [type]:this.state.username.trim(),
                password:this.state.password.trim()
            }).then((data)=>{
                //console.log(data.headers);
                this.setState({...this.state,spinner:false});
                this.props.setToken(data.headers["x-auth"],data.data.name);
                alert(data.data.message);
                window.location.pathname='/tasks';
            }).catch(err=>{
                console.log(err);
                this.setState({...this.state,spinner:false})
                alert("Wrong Credentials entered by the user");
            })
        }else{
            if(this.state.match){
            axios.post(process.env.REACT_APP_BACKEND+'/userForm',{
                username:this.state.username,
                password:this.state.password,
                name:this.state.fullname,
                email:this.state.email,
            }).then((data)=>{
                this.setState({...this.state,spinner:false})
                console.log(data.data.message);
                alert(data.data.message);
                this.props.setToken(data.headers["x-auth"],data.data.name);
                window.location.pathname='/tasks';
            }).catch(err=>{
                console.log(err);
                this.setState({...this.state,spinner:false})
                alert("Specified formats for user information not matched");
            })
            }else{
                this.setState({...this.state,spinner:false})
                alert("Entered passwords do not match");
            }
        }

    }

    render() {
        return (
            <div className="inup" style={{paddingTop:"100px"}}>
            <div className="signupForm" hidden={!this.state.signin}>
                <h2 className="sign">Sign Up</h2><br/>
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
                    <Form.Text style={{color:"green"}} hidden={!this.state.match || this.state.reenter.length==0}>
                    Passwords matched
                    </Form.Text>
                    <Form.Text style={{color:"red"}} hidden={this.state.match || this.state.reenter.length==0}>
                    Passwords not matched
                    </Form.Text>
                </Form.Group> 

                <Button variant="primary" onClick={this.submit}>Signup</Button>
                <img src={Spinner} id="loginSpinner" hidden={!this.state.spinner}/>
                <br/>
                <small className="switch" onClick={this.switch}>Already have an account ? <span>Sign In</span></small>
            </div>

            <div className="signupForm" hidden={this.state.signin}>
                <h2 className="sign">Sign In</h2><br/>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Enter username/email" id='username' 
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

                <Button variant="primary" onClick={this.submit}>SignIn</Button>
                <img src={Spinner} id="loginSpinner" hidden={!this.state.spinner}/><br/>
                <small className="switch" onClick={this.switch}>New to use Task Manager ? <span>Sign Up</span></small>
            </div>
            </div>
        )
    }
}
