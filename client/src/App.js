import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
  // Link
} from "react-router-dom";

import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/ResgisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <div>
        

        <hr />

        
        <Switch>
          {/* 방법 1 */}
            {/* <Route exact path="/">
              <LandingPage />
            </Route> */}
          {/* 방법 2  - 더 간단한 방법 */}
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={LoginPage} />
          <Route exact path="/register" component={RegisterPage} />
        </Switch>
      </div>
    </Router>
  )
}



export default App
