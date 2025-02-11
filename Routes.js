import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";

const rutaServidor = "http://localhost/gespa";

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path={rutaServidor} component={About} />
        <Route path={rutaServidor} component={Home} />
      </Switch>
    </Router>
  );
}

export default Routes;
