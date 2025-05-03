import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TaskModal from "../../modal/taskModal/TaskModal"; // Import the TaskModal component

const TaskDash = () => {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [mode, setMode] = useState("create");
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    priority: "",
    deadline: "",
    status: "",
  });

  const token = JSON.parse(localStorage.getItem("admin"))?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        const [tasksRes, employeesRes] = await Promise.all([
          fetch("/getTask", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/getEmployee", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const tasksData = await tasksRes.json();
        const employeesData = await employeesRes.json();

        setTasks(tasksData);
        setEmployees(employeesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure to delete this task?")) {
      try {
        const res = await fetch(`/task/${taskId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
        } else {
          alert("Failed to delete task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const openModal = (mode, task = null) => {
    setMode(mode);
    if (mode === "edit") {
      setEditData(task);
      setTaskData({
        ...task,
      });
    } else {
      setTaskData({
        title: "",
        description: "",
        assignedTo: "",
        priority: "",
        deadline: "",
        status: "",
      });
    }
    setModalOpen(true);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Task Dashboard</h1>
      <button onClick={() => openModal("create")}>Create Task</button>

      <div className="task-list">
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid #ccc",
              margin: "1rem 0",
              padding: "1rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description}</p>
                <p>Assigned to: {task.assignedTo?.name}</p>
                <p>Status: {task.status}</p>
                <p>Priority: {task.priority}</p>
                <p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>
              </div>

              <div>
                <button onClick={() => openModal("edit", task)}>Edit</button>
                <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <TaskModal
          mode={mode}
          taskData={taskData}
          setTaskData={setTaskData}
          employees={employees}
          token={token}
          setModalOpen={setModalOpen}
          setTasks={setTasks}
          editData={editData}
          setEditData={setEditData}
        />
      )}
    </div>
  );
};

export default TaskDash;
