import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CodePush from "./pages/CodePush";
import Apps from "./pages/AppsList";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/apps" replace />} />
        <Route path="/apps" element={<Apps />} />
        <Route path="/apps/:appName" element={<CodePush />} />
      </Routes>
    </Router>
  );
};

export default App;