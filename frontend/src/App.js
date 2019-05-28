import React,{Component} from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import ClientForm from './components/ClientForm';
import Tasks from './components/Tasks';
import ClientsList from './components/ClientsList';
import SingleClient from './components/SingleClient'; 
import Logins from './components/Logins';


export default class App extends Component{
  state={token:"",name:""}
  componentWillMount(){
    this.setState({
      ...this.state,
      token:localStorage.getItem('token'),
      name:localStorage.getItem('name')
    })  
    console.log(this.state.token);
  }

  refreshState=()=>{
    this.setState({
      ...this.state,
      token:localStorage.getItem('token'),
      token:localStorage.getItem('name')
    })
  }
  setToken=(newToken,name)=>{
    localStorage.setItem("token",newToken);
    localStorage.setItem('name',name)
    this.refreshState();
  }
  removeToken=()=>{
    console.log("removed");
    localStorage.setItem("token","");
    localStorage.setItem("name","");
    this.refreshState();  
  }
  
  render(){
    console.log(window.location.pathname=='/');
    return (
      <BrowserRouter>
        <div className="App" style={{display:'flex',flexDirection:'row'}}>
          <Navigation removeToken={this.removeToken} token={this.state.token} name={this.state.name}/>
          <Route path="/clientForm" render={() => <ClientForm token={this.state.token} />}/>
          <Route path="/tasks" render={() => <Tasks token={this.state.token} />}/>
          <Route path="/clientList" render={() => <ClientsList token={this.state.token} />}/>
          <Route path="/client/:id" render={() => <SingleClient {...this.props} token={this.state.token} />}/>
          <Route exact path="/" render={() => <Logins token={this.state.token} setToken={this.setToken}/>}/>
        </div>
      </BrowserRouter>
    );
  }
}

