import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Client from '../Client/Client';
import Home from '../Home/Home';
import AccountExecutives from '../AccountExecutives/AccountExecutives';

const App = () => {
  return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/temsilci" component={AccountExecutives}/>
            <Route exact path="/musteri" component={Client}/>
            <Route exact path="/" component={Home} /> 
          </Switch>
        </div>
      </Router>
  );
};  

export default App