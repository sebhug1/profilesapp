import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
//import Home from "./Home.jsx";
import TodoList from "./TodoList.jsx";
import "./index.css";
import { Authenticator } from "@aws-amplify/ui-react";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import '@aws-amplify/ui-react/styles.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Authenticator>
    <App />
    <TodoList />
    </Authenticator>
  </React.StrictMode>
);