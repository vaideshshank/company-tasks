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
  state={token:""}
  componentWillMount(){
    this.setState({
      ...this.state,
      token:localStorage.getItem('token')
    })  
    console.log(this.state.token);
  }

  refreshState=()=>{
    this.setState({
      ...this.state,
      token:localStorage.getItem('token')
    })
  }
  setToken=(newToken)=>{
    localStorage.setItem("token",newToken);
    this.refreshState();
  }

  removeToken=()=>{
    console.log("removed");
    localStorage.setItem("token","");
    this.refreshState();  
  }
  render(){
    return (
      <BrowserRouter>
        <div className="App">
          <Navigation removeToken={this.removeToken} token={this.state.token}/>
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

