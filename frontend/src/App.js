import React from 'react';
import {BrowserRouter,Route} from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import ClientForm from './components/ClientForm';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navigation/>
        <Route path="/clientForm" component={ClientForm}/>
      </div>
    </BrowserRouter>
  );
}

export default App;
