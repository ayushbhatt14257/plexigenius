import React, { useEffect } from "react";
import './task.css'

const TaskModal = ({
  mode,
  taskData,
  setTaskData,
  employees,
  token,
  setModalOpen,
  setTasks,
  editData,
  setEditData,
}) => {
  useEffect(() => {
    if (mode === "edit" && editData) {
      
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

     
      setTaskData({
        title: editData.title || "",
        description: editData.description || "",
        assignedTo: editData.assignedTo?._id || editData.assignedTo || "",
        priority: editData.priority || "",
        deadline: formatDate(editData.deadline), 
        status: editData.status || "",
      });
    }
  }, [mode, editData, setTaskData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleCreateOrUpdateTask = async () => {
    if (!taskData.status || !taskData.priority || !taskData.assignedTo) {
      alert("Please select all required fields: status, priority, and assigned employee");
      return;
    }

    const url =
      mode === "create"
        ? "http://localhost:5000/task"
        : `http://localhost:5000/task/${editData._id}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const resData = await res.json();

      if (res.ok) {
        const updatedTask = {
          ...resData,
          assignedTo:
            employees.find((emp) => emp._id === resData.assignedTo) || resData.assignedTo,
        };

        if (mode === "create") {
          setTasks((prevTasks) => [...prevTasks, updatedTask]);
        } else {
          setTasks((prevTasks) =>
            prevTasks.map((task) =>
              task._id === editData._id ? updatedTask : task
            )
          );
        }

        setModalOpen(false);
        setEditData(null);
        setTaskData({
          title: "",
          description: "",
          assignedTo: "",
          priority: "",
          deadline: "",
          status: "",
        });
      } else {
        alert(resData.error || "Failed to create/update task");
      }
    } catch (error) {
      console.error("Error creating/updating task:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{mode === "create" ? "Create Task" : "Edit Task"}</h2>

        <input
          type="text"
          name="title"
          value={taskData.title}
          onChange={handleChange}
          placeholder="Title"
        />

        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <select
          name="assignedTo"
          value={taskData.assignedTo}
          onChange={handleChange}
        >
          <option value="">Select Employee</option>
          {employees.map((employee) => (
            <option key={employee._id} value={employee._id}>
              {employee.name}
            </option>
          ))}
        </select>

        <select
          name="priority"
          value={taskData.priority}
          onChange={handleChange}
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <input
          type="date"
          name="deadline"
          value={taskData.deadline}
          onChange={handleChange}
        />

        <select
          name="status"
          value={taskData.status}
          onChange={handleChange}
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <button onClick={handleCreateOrUpdateTask}>
          {mode === "create" ? "Create" : "Update"}
        </button>

        <button onClick={() => setModalOpen(false)}>Cancel</button>
      </div>
    </div>
  );
};

export default TaskModal;
