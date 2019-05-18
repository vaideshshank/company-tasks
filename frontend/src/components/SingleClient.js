import React, { Component } from 'react';
import Card from 'react-bootstrap/Card'
import axios from 'axios';

export default class SingleClient extends Component {
  state={
      client:{},
      tasks:[]
    }

  componentDidMount(){
     var { match: { params } } = this.props;
      axios.get(process.env.REACT_APP_BACKEND+'/singleClient/'+params.id).then(data=>{
          this.setState({
            ...this.state,
            client:data.data.clientData,
            tasks:data.data.tasks
          })
    })
  }
  

  render() {
    return (
      <div style={{backgroundColor:'rgba(108, 245, 188, 0.4)',padding:'20px'}}>
      {
        <Card style={{ width:'90vw',display:'flex',margin:"0 auto"}}>
        <Card.Body style={{textAlign:'left'}}>
            <Card.Title style={{fontSize:'40px'}}>{this.state.client.name}</Card.Title>
            <Card.Text>
              <h5><strong>Profession : </strong>{this.state.client.profession}</h5>
              <h5><strong>Email : </strong>{this.state.client.email}</h5>
              <h5><strong>Phone : </strong>{this.state.client.phone}</h5>
              <h5><strong>Address : </strong>{this.state.client.address}</h5>
            </Card.Text>
        </Card.Body>
        <Card.Img src="../images/placeholder.jpg" />
        </Card>
      }

      
      </div>
    )
  }
}
