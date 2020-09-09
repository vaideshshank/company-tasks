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
  removeToken=(e)=>{
    e.preventDefault();
    console.log(this.props);
    axios.get(process.env.REACT_APP_BACKEND+"/signout",{headers:{"x-auth":this.props.token}}).then(resp=>{
      alert(resp.data.message);
      this.props.removeToken();
      window.location.pathname="";
    }).catch(err=>{
      alert(err.data.message);
    })
  }
  render() {
    return (
      <nav hidden={window.location.pathname=='/'}  style={{position: 'fixed',zIndex:"1"}}>
        <Navbar collapseOnSelect bg="dark" expand="lg" variant="dark" style={{display: "flex", flexDirection: "column", width: "20vw", height: "100vh",margin:"0",padding:"0"}}>
            <Navbar.Brand   style={{fontSize:'35px',background:"white",color:'black',paddingRight:"1.7vw",
            paddingLeft:"1.7vw",margin:"0",marginTop:"-9px"}}>Tasks Manager</Navbar.Brand> <br/>
            <h5  style={{color:'rgb(190, 255, 233)'}}>Hi, <b>{this.props.name}</b></h5>
            <Nav className="mr-auto" style={{fontSize:'20px',display:"flex",flexDirection:"column"}}>
                <Link to="/clientForm" className="links">Add Client</Link>
                <Link to="/clientList" className="links">My Clients</Link>
                <Link to="/tasks" className="links">Tasks</Link>
                {/* <Link to="/assignedTasks" style={{color:'white'}}>Assigned Tasks</Link> */}
                <Link to="/" hidden={this.props.token!==""} className="links">Signup/SignIn</Link>
                <Link to="/" hidden={this.props.token===""} className="links" onClick={this.removeToken}>Logout</Link>
            </Nav>
        </Navbar>
      </nav>
    )
  }
}
