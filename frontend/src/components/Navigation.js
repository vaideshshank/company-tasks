import React, { Component } from 'react'
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
export default class Navigation extends Component {
  render() {
    
    return (
      <nav>
        <Navbar collapseOnSelect bg="dark" expand="lg" variant="dark">
            <Navbar.Brand href="#home">Tasks</Navbar.Brand>
            <Nav className="mr-auto">
                <Nav.Link><Link to="/clientForm">ClientsForm</Link></Nav.Link>
                <Nav.Link><Link to="/clientList">ClientList</Link></Nav.Link>
                <Nav.Link href="/tasks"><Link to="/tasks">Tasks</Link></Nav.Link>
                <Nav.Link href="/assignedTasks"><Link to="/assignedTasks">Assigned Tasks</Link></Nav.Link>
            </Nav>
        </Navbar>
      </nav>
    )
  }
}
