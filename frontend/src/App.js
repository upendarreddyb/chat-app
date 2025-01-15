import React from "react";
import { Route } from "react-router-dom";
import ChartPage from "./Pages/ChartPage"; 
import HomePage from "./Pages/HomePage";
import "./App.css";
function App() {
  return (
    <div className="App">
      <Route path="/" component={HomePage}  exact/>
      <Route path="/chats" component={ChartPage} /> 
    </div>
  );
}

export default App;
