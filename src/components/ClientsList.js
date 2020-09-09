import React, { Component } from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Card from 'react-bootstrap/Card';
import '../stylesheets/styles.css';
import Spinner from '../images/spinner.gif'
import axios from 'axios';

export default class ClientsList extends Component {
    constructor(props){
        super(props);
        if(props.token==""){
            window.location.pathname="";
        }
    }
    state={
        clients:[],
        spinner:false,
        noClient:false
    }
    clientList(){
        this.setState({...this.state,spinner:true})
        axios.get(process.env.REACT_APP_BACKEND+'/clients',{headers:{"x-auth":this.props.token}}).then(data=>{
            console.log(data);
            this.setState({...this.state,clients:data.data,spinner:false,noClient:data.data.length==0});
        }).catch(err=>{
            console.log(err);
            alert("Please signin or signup to continue");
            window.location.pathname='/';
        });
    }
    componentDidMount(){this.clientList();}
    hoverEffect(e){
        e.target.style.backgroundColor='rgba(192, 221, 226, 0.527)';
        e.target.style.cursor="pointer";
    }
    singleClient(id){
        window.location.pathname='/client/'+id;   
    }

    delete=(e,id,image)=>{
        e.stopPropagation();
        console.log(image)
        var confirm=window.confirm("Are you sure you want to delete this client?");
        if(confirm){
            window.fetch(process.env.REACT_APP_BACKEND+'/deleteClient',{
                method:"DELETE",
                body: JSON.stringify({id,image}),
                headers:{"x-auth":this.props.token,'Content-Type': 'application/json'}
                }).then(data=>{
                        console.log(data);
                alert("Client deleted from the client list");this.clientList();
            }).catch(err=>{
                console.log(err);
                alert(err.message);
            })
        }
    }

  render() {
    return (
      <Jumbotron style={{width:'80vw',transform:'translateX(20vw)',background:'transparent'}}>
        <h2>My Clients</h2>
        <h4 hidden={!this.state.noClient}>No Clients added yet</h4>
        <img src={Spinner} id="clientsSpinner" hidden={!this.state.spinner}/>
        <div style={{display:'flex',flexWrap:'wrap',justifyContent:"space-around"}}>
        {
            this.state.clients.map(({name,email,profession,_id,image})=>{
                return <Card onMouseOver={this.hoverEffect}
                             key={_id} style={{ width: '18rem',backgroundColor:'rgb(192, 221, 226)',margin:'5px',
                             boxShadow:"0 2px 5px gray"} }
                             onClick={()=>this.singleClient(_id)}>
                <Card.Body>
                    <button type="button" class="close" onClick={(e)=>this.delete(e,_id,image)}>
                        <span aria-hidden="true">&times;</span>
                    </button>
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
