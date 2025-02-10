import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import Apps from "./pages/AppsList";
import AuthPage from "./pages/AuthPage";
import CodePush from "./pages/CodePush";
import Register from "./pages/Register";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="" element={<AuthPage />} />
        <Route path="/create-account" element={<Register />} />

        <Route element={<PrivateRoute />}>
          <Route path="/apps" element={<Apps />} />
          <Route path="/apps/:appName/deployments" element={<CodePush />} />
          <Route path="/apps/:appName/deployments/:deployment/history" element={<CodePush />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;