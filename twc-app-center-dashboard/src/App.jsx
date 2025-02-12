import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AppsList from "./pages/AppsList";
import LoginComponent from "./pages/Login";
import DeploymentHistory from "./pages/DeploymentHistory";
import RegisterComponent from "./pages/Register";

import PrivateRoute from "./components/PrivateRoute";

const App = () => {

  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="" element={<LoginComponent />} />
        <Route path="/create-account" element={<RegisterComponent />} />

        <Route element={<PrivateRoute />}>
          <Route path="/apps" element={<AppsList />} />
          <Route path="/apps/:appName/deployments" element={<DeploymentHistory />} />
          <Route path="/apps/:appName/deployments/:deployment/history" element={<DeploymentHistory />} />
        </Route>
      </Routes>
    </Router >
  );
};

export default App;