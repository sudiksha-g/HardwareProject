import React from "react";
import "./App.css";
import Login from "./components/login/login";

function App() {
  return (
    <div className="App">
      <div className="titleContainer">
        <div style={{padding: "24px"}}>Welcome to HaaS Application</div>
      </div>
      <Login />
    </div>
  );
}

export default App;
