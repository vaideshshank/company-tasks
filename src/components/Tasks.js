import React, { Component } from 'react';
import '../stylesheets/styles.css';
import Jumbotron from 'react-bootstrap/Jumbotron';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from '../images/spinner.gif';
import axios from 'axios';

export default class Tasks extends Component {
  constructor(props){
    super(props);
    if(props.token==""){
      window.location.pathname="";
    }
  }
  state={
      deleteAlert:false,
      show:false,
      taskname:"",
      description:"",
      duration:"1 week",tasks:[],
      spinner:true,
      noTask:false
  }
  getTasks=()=>{
    this.setState({...this.state,spinner:false});
    //console.log(this.props.token)
    axios.get(process.env.REACT_APP_BACKEND+'/listTasks',
        {headers:{"x-auth":this.props.token}}).then(({data})=>{
        this.setState({...this.state,
          tasks:data.tasks,
          spinner:true,
          noTask:data.tasks.length==0});
    }).catch(err=>{
        this.setState({...this.state,spinner:true});
        console.log(err);
        alert("Please signin or signup to continue");
        window.location.pathname='/';
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
      axios.post(process.env.REACT_APP_BACKEND+'/tasks',{taskname,description,duration},
      {headers:{"x-auth":this.props.token}}).then(({data})=>{
        this.setState({
            ...this.state,taskname:"",description:""
        })
        console.log(data);
        this.getTasks();
        alert(data.message);
      }).catch(({data})=>{
        this.handleModel();
          console.log(data);
          alert(data);
      })
  }

  delete=(id)=>{
    axios.post(process.env.REACT_APP_BACKEND+'/deleteTask',{task_id:id},
    {headers:{"x-auth":this.props.token}}).then((resp)=>{
      alert(resp.data.message);
      this.getTasks();
    }).catch(err=>{
      console.log(err);
      alert(err.message);
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
      <div className="text-left" style={{width:'80vw',transform:'translateX(20vw)'}} >
        <Modal show={this.state.show} onHide={this.handleModel}>
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


        <Jumbotron style={{background:'transparent'}}>
          <Button variant="success" onClick={this.handleModel}>+ Add Task</Button>
        <h2 style={{marginTop:'30px',marginBottom:'30px'}}>Existing Tasks</h2>
        <h4 hidden={!this.state.noTask}>No Tasks added yet</h4>
        <div className="container">
            <img src={Spinner} hidden={this.state.spinner} id="tasksSpinner"/>
            {
                this.state.tasks.map(({_id,description,taskname,duration})=>{
                    i++;
                    return(
                    <Alert variant={colors[i%(colors.length)]} style={{boxShadow:"0 2px 5px gray"}} key={_id}>
                        <button type="button" class="close" onClick={()=>this.delete(_id)}>
                          <span aria-hidden="true">&times;</span>
                        </button>
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

// var DeleteTaskAlert=()=>{
//   return(
//   <Modal show={this.state.show} onHide={this.handleClose}>
//     <Modal.Header closeButton>
//       <Modal.Title>Modal heading</Modal.Title>
//     </Modal.Header>
//     <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
//     <Modal.Footer>
//       <Button variant="secondary" onClick={this.handleClose}>
//         Close
//       </Button>
//       <Button variant="primary" onClick={this.handleClose}>
//         Save Changes
//       </Button>
//     </Modal.Footer>
//   </Modal>
//   )
// }
