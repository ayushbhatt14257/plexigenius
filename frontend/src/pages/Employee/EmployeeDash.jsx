import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import EmployeeModal from "../../modal/employeeModal/EmployeeModal";
import "./employee.css"; // ✅ Import CSS

const EmployeeDash = () => {
  const { admin } = useContext(AuthContext);
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("create");
  const [toggleMap, setToggleMap] = useState({});

  const token = JSON.parse(localStorage.getItem("admin"))?.token;

  const fetchData = async () => {
    try {
      const [resEmp, resTask] = await Promise.all([
        fetch("/getEmployee", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("/getTask", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const empData = await resEmp.json();
      const taskData = await resTask.json();
      setEmployees(empData);
      setTasks(taskData);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const handleCreateOrUpdate = async (data) => {
    const url =
      mode === "create"
        ? "/employee"
        : `/employee/${editData._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();
    if (res.ok) {
      fetchData();
      setModalOpen(false);
      setEditData(null);
    } else {
      alert(resData.error || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;
    await fetch(`/employee/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchData();
  };

  const toggleDropdown = (id) => {
    setToggleMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const countByStatus = (status) =>
    tasks.filter((task) => task.status === status).length;

  useEffect(() => {
    if (!admin) navigate("/login");
    else fetchData();
  }, [admin, navigate]);

  const statusCounts = tasks.reduce((acc, task) => {
    const status = task.status?.toLowerCase() || "unknown";
    acc[status] = acc[status] || [];
    acc[status].push(task);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <h1>Employee Dashboard</h1>

      <div className="dashboard-stats">
        <div className="stat-box">Total Employees: {employees.length}</div>
        <div className="stat-box">Total Tasks: {tasks.length}</div>
        <div className="stat-box">
          Pending Tasks: {statusCounts.pending?.length || 0}
        </div>
        <div className="stat-box">
          Completed Tasks: {statusCounts.completed?.length || 0}
        </div>
      </div>

      <button
        className="create-button"
        onClick={() => {
          setMode("create");
          setEditData(null);
          setModalOpen(true);
        }}
      >
        Create New Employee
      </button>

      {employees.map((emp) => {
        const assignedTasks = tasks.filter(
          (task) => task.assignedTo?._id === emp._id
        );
        return (
          <div key={emp._id} className="employee-card">
            <div className="employee-header">
              <div className="employee-info">
                <h3>{emp.name}</h3>
                <p>Email: {emp.email}</p>
                <p>Phone: {emp.phone}</p>
                <p>Department: {emp.department || "N/A"}</p>
                <p>Status: {emp.status || "Active"}</p>
              </div>

              <div>
                <button onClick={() => toggleDropdown(emp._id)}>
                  {toggleMap[emp._id] ? "Hide Tasks" : "Show Tasks"}
                </button>
                <button
                  onClick={() => {
                    setEditData(emp);
                    setMode("update");
                    setModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(emp._id)}>Delete</button>
              </div>
            </div>

            {toggleMap[emp._id] && (
              <div className="task-dropdown">
                {assignedTasks.length === 0 ? (
                  <p>No task assigned.</p>
                ) : (
                  assignedTasks.map((task) => (
                    <div key={task._id} className="task-item">
                      <strong>Title:</strong> {task.title} <br />
                      <strong>Description:</strong> {task.description} <br />
                      <strong>Priority:</strong> {task.priority} <br />
                      <strong>Deadline:</strong>{" "}
                      {new Date(task.deadline).toLocaleDateString()} <br />
                      <strong>Status:</strong> {task.status}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}

      {modalOpen && (
        <EmployeeModal
          isOpen={modalOpen}
          mode={mode}
          initialData={editData}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateOrUpdate}
        />
      )}
    </div>
  );
};

export default EmployeeDash;
