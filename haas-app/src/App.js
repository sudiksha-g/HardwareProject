import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  BrowserRouter,
} from "react-router-dom";
import "./App.css";
import Register from "./components/register/register";
import Login from "./components/login/login";
// import Project from "./components/project/project";
import Protected from "./components/protected/protected";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/project" element={<Project />} /> */}
        <Route path="/protected" element={<Protected />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
