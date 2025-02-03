import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CodePush from "./pages/CodePush";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/apps" replace />} />
        <Route path="/apps" element={<CodePush />} />
        <Route path="/apps/code-push" element={<CodePush />} />
      </Routes>
    </Router>
  );
};

export default App;