import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Jumbotron from 'react-bootstrap/Jumbotron';
import axios from 'axios';
import _ from 'lodash';
import Spinner from '../images/spinner.gif';
import '../stylesheets/styles.css'

export default class SingleClient extends Component {
  constructor(props){
    super(props);
    if(props.token==""){
      window.location.pathname="";
  }
  }
  state={
      client:{},
      tasks:[],
      duration:{},
      spinner1:false,
      spinner2:false,
      noTask:false
    }

  loadContent=()=>{
    var id = window.location.pathname.split('/')[2];
      this.setState({...this.state,spinner1:true,spinner2:true})
      axios.get(process.env.REACT_APP_BACKEND+'/singleClient/'+id,
               {headers:{"x-auth":this.props.token}}).then(data=>{
          this.setState({
            ...this.state,
            spinner1:false,
            client:data.data.clientData
          },()=>{
            var tasksVar=data.data.tasks;
            return axios.get(process.env.REACT_APP_BACKEND+'/clientsWithTasks/'+id,
            {headers:{"x-auth":this.props.token}}).then(data2=>{  
              tasksVar=_.map(tasksVar,(task,ind)=>{
                var exists,{_id}=task,duration,check=(_.find(data2.data,{_id})),spinner3=false;
                console.log(check);
                if(!check){
                  exists=true;duration=null;
                }else{exists=false;duration=check.clients[0].duration}
                return {...task,exists,duration,spinner3};
              });
              this.setState({
                ...this.state,
                spinner2:false,
                tasks:tasksVar,
                noTask:data.data.tasks.length==0
              })
            })
          })
    }).catch(err=>{
      console.log(err);
      alert("Please signin or signup to continue");
      window.location.pathname='/';
  });
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

  assignTask=(id,index)=>{
    var duration=this.state.duration.number+" "+this.state.duration.timeline;
    //console.log(duration);
    this.setState({[this.state.tasks[index]]:{spinner3:true}});
    console.log("crecre"+this.state.tasks[index].spinner3);
    axios.post(process.env.REACT_APP_BACKEND+'/addClientToTask',{
          client_id:this.state.client._id,
          task_id:id,
          user_id:this.state.client.user,
          duration
    },{headers:{"x-auth":this.props.token}}).then(()=>{
      console.log('Task assigned');
      alert('Task assigned to client');
      this.setState({
        ...this.state,
        duration:{}
      },()=>{
        this.setState({[this.state.tasks[index]]:{spinner3:false}});
        console.log(this.state.tasks[index].spinner3);
        this.loadContent();
      })
    }).catch(err=>{
      console.log(err);
      this.setState({[this.state.tasks[index]]:{spinner3:false}});
      console.log(this.state.tasks[index].spinner3);
      alert('Task not assigned. Server failure');
    })
  }

  removeClient(id,index){
    console.log("REMOVE: "+id,this.state.client._id);
    this.setState({[this.state.tasks[index]]:{spinner3:true}});
    console.log(this.state.tasks[index].spinner3);
    axios.post(process.env.REACT_APP_BACKEND+'/removeClientFromTask',
    {task_id:id,client_id:this.state.client._id},
    {headers:{"x-auth":this.props.token}}).then((resp)=>{
      this.setState({...this.state});
      this.setState({[this.state.tasks[index]]:{spinner3:false}});
      console.log(this.state.tasks[index].spinner3);
      alert(resp.data.message);
      this.loadContent();
    }).catch(err=>{
      this.setState({[this.state.tasks[index]]:{spinner3:false}});
      console.log(this.state.tasks[index].spinner3);
      alert("Error Occurred");
    })
  }

  render() {
    return (
      <div style={{padding:"10px",width: "77vw", transform: "translateX(21vw)"}} >
      {
        <Card className="clientInfo">
        <img src={Spinner} id="clientInfoSpinner" hidden={!this.state.spinner1}/>
        <Card.Body style={{textAlign:'left'}} hidden={this.state.spinner1}>
            <Card.Title style={{fontSize:'40px'}}>{this.state.client.name}</Card.Title>
            <Card.Text>
              <h5><strong>Profession : </strong>{this.state.client.profession}</h5>
              <h5><strong>Email : </strong>{this.state.client.email}</h5>
              <h5><strong>Phone : </strong>{this.state.client.phone}</h5>
              <h5><strong>Address : </strong>{this.state.client.address}</h5>
            </Card.Text>
        </Card.Body>
        <Card.Img src={`${process.env.REACT_APP_BACKEND}/../${this.state.client.image}`}
         hidden={this.state.spinner1} style={{height:'150px', width:'150px'}}/>
        </Card>
      }
      <Jumbotron style={{width:'75vw', margin:'0 auto', backgroundColor:'transparent'}}>
        <h2>Available Tasks</h2>
        <img src={Spinner} id="clientTasksSpinner" hidden={!this.state.spinner2}/><br/>
        <h4 hidden={!this.state.noTask}>No Tasks added yet</h4>
        <div style={{display:'flex',flexWrap:'wrap'}}>
          
        
      {
        this.state.tasks.map(({date_created,_id,taskname,description,exists,duration},index)=>{
          return(
          <Card style={{ width:'60vw',margin:"0 auto"}}>
          <Card.Body style={{textAlign:'left',width:'50vw'}}>
              <Card.Title style={{fontSize:'30px'}}>{taskname}</Card.Title>
              <Card.Text>
                <div>{description}</div>
                <div><strong>Date created : </strong>{date_created.split('T')[0]}</div>
                {
                 (()=>{
                    if(!exists){
                      return <div><strong>Deadline : </strong>{duration}</div>
                    }
                  })()
                }
                
              </Card.Text>
          </Card.Body>
          <div style={{margin:'20px',textAlign:"left"}} hidden={exists}>
          <Button variant="danger" style={{maxWidth:'140px'}} onClick={()=>this.removeClient(_id,index)}>Dismiss Task</Button>
          </div>

          <div className="form-row align-items-center" style={{margin:'20px',textAlign:'left'}} hidden={!exists}>
            <h6>Set Deadline : </h6>
            <div className="col-auto my-1" style={{display:'flex'}}>
              <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" style={{maxWidth:'200px'}} id="number" onChange={this.updateDuration}>
                <option value="0" selected>Choose number...</option>
                {
                  [...Array(20).keys()].map((val,ind)=>{
                    return <option value={val+1} key={ind}>{val+1}</option>
                  })
                }
              </select>
              <select className="custom-select mr-sm-2" id="inlineFormCustomSelect" style={{maxWidth:'200px'}} id="timeline" onChange={this.updateDuration}>
                <option value="none" selected>Choose timeframe...</option>
                <option value="Hours">Hours</option>
                <option value="Days">Days</option>
                <option value="Weeks">Weeks</option>
                <option value="Months">Months</option>                
              </select>
            </div>
            <Button variant="primary" style={{maxWidth:'120px',display:'block'}} onClick={()=>this.assignTask(_id,index)}>Assign Task</Button>
            <img src={Spinner} id="clientTaskAssSpinner" hidden={!this.state.tasks[index].spinner3}/>
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

