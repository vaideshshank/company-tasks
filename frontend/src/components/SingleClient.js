import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import axios from 'axios';
import _ from 'lodash';

export default class SingleClient extends Component {
  state={
      client:{},
      tasks:[],
      duration:{}
    }

  loadContent=()=>{
    var { match: { params } } = this.props;
      axios.get(process.env.REACT_APP_BACKEND+'/singleClient/'+params.id).then(data=>{
          this.setState({
            ...this.state,
            client:data.data.clientData
          },()=>{
            var tasksVar=data.data.tasks;
            axios.get(process.env.REACT_APP_BACKEND+'/clientsWithTasks/'+params.id).then(data2=>{  
              tasksVar=_.map(tasksVar,(task,ind)=>{
                var exists,{_id}=task;
                (_.find(data2.data,{_id})) ? exists=false:exists=true;
                //console.log({exists});
                return {...task,exists};
              });
              //console.log(tasksVar);
              this.setState({
                ...this.state,
                tasks:tasksVar
              },()=>{
                //console.log(this.state.tasks);
              })
            })
          })
    })
  }
  componentDidMount(){
     this.loadContent();
  }
  
  updateDuration=(e)=>{
    this.setState({
      ...this.state,
      duration:{
        ...this.state.duration,
        [e.target.id]:e.target.value
      }
    })
  }

  assignTask=(id)=>{
    var duration=this.state.duration.number+" "+this.state.duration.timeline;
    //console.log(duration);
    axios.post(process.env.REACT_APP_BACKEND+'/addClientToTask',{
          client_id:this.state.client._id,
          task_id:id,
          user_id:this.state.client.user,
          duration
    }).then(()=>{
      console.log('Task assigned');
      alert('Task assigned to client');
      this.setState({
        ...this.state,
        duration:{}
      },()=>{
        this.loadContent();
      })
    }).catch(err=>{
      console.log(err);
      alert('Task not assigned. Server failure');
    })
  }

  removeClient(id){
    console.log("REMOVE: "+id,this.state.client._id);
    axios.post(process.env.REACT_APP_BACKEND+'/removeClientFromTask',
    {task_id:id,client_id:this.state.client._id}).then((resp)=>{
      alert(resp.data.message);
      this.loadContent();
    }).catch(err=>{
      alert("Error Occurred");
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
      <Jumbotron style={{width:'90vw', margin:'0 auto'}}>
        <h2>Available Tasks</h2>
        <div style={{display:'flex',flexWrap:'wrap'}}>
      {
        this.state.tasks.map(({date_created,_id,taskname,description,exists})=>{
          return(
          <Card style={{ width:'60vw',margin:"0 auto"}}>
          <Card.Body style={{textAlign:'left',width:'50vw'}}>
              <Card.Title style={{fontSize:'30px'}}>{taskname}</Card.Title>
              <Card.Text>
                <div>{description}</div>
                <div><strong>Date created : </strong>{date_created.split('T')[0]}</div>
                <div><strong>Deadline : </strong>{}</div>
              </Card.Text>
          </Card.Body>
          <div style={{margin:'20px',textAlign:"left"}} hidden={exists}>
          <Button variant="danger" style={{maxWidth:'120px'}} onClick={()=>this.removeClient(_id)}>Dismiss Task</Button>
          </div>

          <div class="form-row align-items-center" style={{margin:'20px',textAlign:'left'}} hidden={!exists}>
            <h6>Deadline : </h6>
            <div class="col-auto my-1" style={{display:'flex'}}>
              <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" style={{maxWidth:'200px'}} id="number" onChange={this.updateDuration}>
                <option value="0" selected>Choose number...</option>
                {
                  [...Array(20).keys()].map((val)=>{
                    return <option value={val+1}>{val+1}</option>
                  })
                }
              </select>
              <select class="custom-select mr-sm-2" id="inlineFormCustomSelect" style={{maxWidth:'200px'}} id="timeline" onChange={this.updateDuration}>
                <option value="none" selected>Choose timeframe...</option>
                <option value="Hours">Hours</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>                
              </select>
            </div>
            <Button variant="primary" style={{maxWidth:'120px',display:'block'}} onClick={()=>this.assignTask(_id)}>Assign Task</Button>
          </div>
          </Card>)
        })
      }
      </div>
      </Jumbotron>
      
      </div>
    )
  }
}

