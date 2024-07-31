import React from "react";
import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom';
import "./App.css";
import Login from "./components/login/login";
import NewUserForm from "./components/Register/newUser";

function App() {
  return (
    <>
    <div className="titleContainer">
        <div style={{padding: "24px"}}>Welcome to HaaS Application</div>
      </div>
    <BrowserRouter>      
      <Routes>
      <Route path="/" element={<Login />}/>     
      <Route path="/register" element={<NewUserForm />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
