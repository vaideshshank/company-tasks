import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import '../stylesheets/styles.css';
import axios from 'axios';

export default class ClientsList extends Component {
    constructor(props){
        super(props);
    }
    state={
        clients:[]
    }
    clientList(){
        axios.get(process.env.REACT_APP_BACKEND+'/clients',{headers:{"x-auth":this.props.token}}).then(data=>{
            this.setState({...this.state,clients:data.data});
        })
    }
    componentDidMount(){this.clientList();}
    hoverEffect(e){
        e.target.style.backgroundColor='rgba(192, 221, 226, 0.527)';
        e.target.style.cursor="pointer";
    }
    singleClient(id){
        window.location.pathname='/client/'+id;   
    }

  render() {
    return (
      <Jumbotron>
        <h2>My Clients</h2>
        <div style={{display:'flex',flexDirection:'row',flexWrap:'wrap'}}>
        {
            this.state.clients.map(({name,email,profession,_id})=>{
                return <Card onMouseOver={this.hoverEffect}
                             key={_id} style={{ width: '18rem',backgroundColor:'rgb(192, 221, 226)',margin:'5px'}} 
                             onClick={()=>this.singleClient(_id)}>
                <Card.Body>
                    <Card.Title>{name}</Card.Title>
                    <Card.Text>
                    <h6><strong>Profession : </strong>{profession}</h6>
                    <h6><strong>Email : </strong>{email}</h6>
                    </Card.Text>
                </Card.Body>
                </Card>
            })
        }
        </div>
      </Jumbotron>
    )
  }
}
