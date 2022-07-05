import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Home from "./Home";
import NotFound from './404';


function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact><Home /></Route>
        <Route path="/404" exact><NotFound /></Route>
        <Redirect to="/404" />
      </Switch>
    </Router>
  );
}

export default App;
