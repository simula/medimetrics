import "./App.css";
import React from "react";
import AddMetricSet from "./components/addMetricSet";
import { Switch, Route, withRouter, Redirect } from "react-router-dom";
import Home from "./components/home";
import Footer from "./commonComponents/footer";
import EditMetricSet from "./components/editMetricSet";
import CMatrix from "./components/confusionMatrices";

function App() {
  return (
    <div className="App" style={{ position: "relative" }}>
      <Switch>
        <Route path="/newmetricset" exact component={AddMetricSet} />
        <Route path="/confusionMatrix" exact component={CMatrix} />
        <Route path="/:methodname" exact component={EditMetricSet} />
        <Route path="/" exact component={Home} />
        <Redirect from="/" to="/" />
      </Switch>
      <Footer text={` SimulaMet 2021`} />
    </div>
  );
}
export default withRouter(App);
