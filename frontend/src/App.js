import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import ClientForm from './components/ClientForm';
import Tasks from './components/Tasks';
import ClientsList from './components/ClientsList';
import SingleClient from './components/SingleClient'; 


function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation/>
        <Route path="/clientForm" component={ClientForm}/>
        <Route path="/tasks" component={Tasks}/>
        <Route path="/clientList" component={ClientsList}/>
        <Route path="/client/:id" component={SingleClient}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
