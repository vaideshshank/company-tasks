import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import axios from 'axios';
import '../stylesheets/styles.css';
export default class Navigation extends Component {
  constructor(props){
    super(props);
  }
  removeToken(e){
    e.preventDefault();
    console.log(this.props);
    axios.post(process.env.REACT_APP_BACKEND,{},{headers:{"x-auth":this.props.token}}).then(resp=>{
      alert(resp.data.message);
      this.props.removeToken();
    }).catch(err=>{
      alert(err.data.message);
    })
  }
  render() {
    return (
      <nav>
        <Navbar collapseOnSelect bg="dark" expand="lg" variant="dark">
            <Navbar.Brand href="#home" style={{fontSize:'40px'}}>Tasks Manager</Navbar.Brand>
            <Nav className="mr-auto" style={{fontSize:'20px',display:'block',float:'right'}}>
                <Link to="/clientForm" style={{color:'white'}}>ClientsForm</Link>
                <Link to="/clientList" style={{color:'white'}}>ClientList</Link>
                <Link to="/tasks" style={{color:'white'}}>Tasks</Link>
                <Link to="/assignedTasks" style={{color:'white'}}>Assigned Tasks</Link>
                <Link to="/" style={{color:'white'}} hidden={this.props.token!==""}>Signup/SignIn</Link>
                <Link to="/" style={{color:'white'}} hidden={this.props.token===""} onClick={this.removeToken}>Logout</Link>
            </Nav>
        </Navbar>
      </nav>
    )
  }
}
