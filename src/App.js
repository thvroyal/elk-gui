import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';

const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
  }
]
function App() {
  return (
    <Router>
      <Switch>
        {routes.map(route => (
          <Route key={route.path} {...route} />
        ))}
      </Switch>
    </Router>
  );
}

export default App;
