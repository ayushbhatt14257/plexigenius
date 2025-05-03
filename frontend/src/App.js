import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./Layout/navbar/Nav"; 
import Login from "./pages/Login/Login";
import EmployeeDash from "./pages/Employee/EmployeeDash";
import TaskDash from "./pages/Task/TaskDash";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { admin } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {admin && (
        <Route element={<NavBar />}>
          <Route path="/employee" element={<EmployeeDash/>} />
          <Route path="/task" element={<TaskDash/>} />
        </Route>
      )}

      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
