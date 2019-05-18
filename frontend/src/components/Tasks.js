import React, { Component } from 'react';
import '../stylesheets/styles.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

export default class Tasks extends Component {
  state={
      show:false,
      taskname:"",
      description:"",
      duration:"1 week",tasks:[]
  }
  getTasks=()=>{
    axios.get(process.env.REACT_APP_BACKEND+'/listTasks').then(({data})=>{
        this.setState({...this.state,tasks:data.tasks});
    }).catch(err=>{
        console.log(err);
        alert(err.data.message);
    });
  }

  componentDidMount(){
    this.getTasks();
  }

  updateState=(e)=>{
      this.setState({
          ...this.state,
          [e.target.id]:e.target.value
      })
  }

  submit=()=>{
      var {taskname,description,duration}=this.state;
      axios.post(process.env.REACT_APP_BACKEND+'/tasks',{taskname,description,duration}).then(({data})=>{
        this.setState({
            ...this.state,taskname:"",description:""
        })
        console.log(data);
        this.getTasks();
        alert(data.message);
      }).catch(({data})=>{
          console.log(data);
          alert(data);
      })
  }

  handleModel=()=>{
    var show=this.state.show;
    console.log(show);
    if(show){this.setState({...this.state,show:false})}
    else{this.setState({...this.state,show:true})}
  }

  render() {
    var colors=['info','secondary','success','warning'],i=-1;
    return (
      <div className="text-left">
        <Modal show={this.state.show} onHide={this.handleModal}>
          <Modal.Header closeButton>
            <Modal.Title>New Task</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className="mb-3">
              <InputGroup.Prepend><InputGroup.Text id="taskname">Task Name</InputGroup.Text></InputGroup.Prepend>
              <FormControl placeholder="Task title" aria-label="Username" 
                  aria-describedby="taskname" id="taskname" onChange={this.updateState}/>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Prepend>
                <InputGroup.Text id="description">Description</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl as="textarea" placeholder="Describe the task to be performed"
                    aria-label="With textarea" id="description" onChange={this.updateState}/>
            </InputGroup>
            <Button variant="primary" className="align-left" onClick={this.submit}>Add Task</Button>

          </Modal.Body>
          
        </Modal>


        <Jumbotron>
          <Button variant="success" onClick={this.handleModel}>+ Add Task</Button>
        <h2>Existing Tasks</h2>
        <div className="container">
            {
                this.state.tasks.map(({_id,description,taskname,duration})=>{
                    i++;
                    return(
                    <Alert variant={colors[i%(colors.length)]} key={_id} dismissible>
                        <h3>{taskname}</h3>
                        <p>{description}</p>
                        <strong>Duration : </strong>{duration}
                    </Alert>)
                })
            }
        </div>
        </Jumbotron>
      </div>
    )
  }
}
