
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const API = "http://localhost:5000/api/tasks";

// Get token from localStorage or sessionStorage
const getToken = () => {
  return (
    localStorage.getItem("token") ||
    sessionStorage.getItem("token")
  );
};

// Get logged-in student details
const getUser = () => {
  const user =
    localStorage.getItem("user") ||
    sessionStorage.getItem("user");

  return user ? JSON.parse(user) : null;
};

function Tasks() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = getUser();

  // Authentication headers
  const getAuthConfig = () => {
    const token = getToken();

    if (!token) {
      throw new Error("Please login again.");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  // Handle expired or invalid token
  const handleAuthError = (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");

      alert("Your session has expired. Please login again.");
      navigate("/");
      return true;
    }

    return false;
  };

  // READ: Fetch logged-in student's tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const config = getAuthConfig();
      const res = await axios.get(API, config);

      setTasks(res.data);
      setError("");

    } catch (err) {
      if (handleAuthError(err)) return;

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to load tasks. Check your backend."
      );

    } finally {
      setLoading(false);
    }
  };

  // Check login and load tasks
  useEffect(() => {
    if (!getToken()) {
      navigate("/");
      return;
    }

    fetchTasks();
  }, []);

  // Clear form
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setDueDate("");
    setEditingId(null);
  };

  // CREATE and UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    const taskData = {
      title,
      description,
      priority,
      dueDate: dueDate || null
    };

    try {
      const config = getAuthConfig();

      if (editingId) {
        await axios.put(
          `${API}/${editingId}`,
          taskData,
          config
        );

        alert("Task updated successfully!");

      } else {
        await axios.post(
          API,
          taskData,
          config
        );

        alert("Task added successfully!");
      }

      clearForm();
      await fetchTasks();

    } catch (err) {
      if (handleAuthError(err)) return;

      alert(
        err.response?.data?.message ||
        "Unable to save task."
      );
    }
  };

  // Edit task
  const editTask = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority);

    setDueDate(
      task.dueDate
        ? task.dueDate.substring(0, 10)
        : ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // UPDATE: Change status
  const updateStatus = async (task) => {
    const status =
      task.status === "Pending"
        ? "In Progress"
        : task.status === "In Progress"
        ? "Completed"
        : "Pending";

    try {
      const config = getAuthConfig();

      await axios.put(
        `${API}/${task._id}`,
        { status },
        config
      );

      await fetchTasks();

    } catch (err) {
      if (handleAuthError(err)) return;

      alert("Unable to update status.");
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      const config = getAuthConfig();

      await axios.delete(
        `${API}/${id}`,
        config
      );

      await fetchTasks();

    } catch (err) {
      if (handleAuthError(err)) return;

      alert("Unable to delete task.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/", { replace: true });
  };

  // Statistics
  const completed = tasks.filter(
    task => task.status === "Completed"
  ).length;

  const pending = tasks.filter(
    task => task.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    task => task.status === "In Progress"
  ).length;

  // Search and filters
  const filteredTasks = tasks.filter(task => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" ||
      task.status === filterStatus;

    const matchesPriority =
      filterPriority === "All" ||
      task.priority === filterPriority;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPriority
    );
  });

  return (
    <div className="app">

      {/* HEADER */}
      <header className="header">
        <div>
          <h1>🎓 Student Task Manager</h1>
          <p>Organize your studies. Achieve your goals.</p>
        </div>
      </header>

      <main className="container">

        {/* LOGOUT BUTTON - TOP RIGHT */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "35px",
            marginBottom: "20px"
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "#8e2de2",
              color: "white",
              border: "none",
              padding: "9px 22px",
              fontSize: "14px",
              fontWeight: "600",
              borderRadius: "7px",
              cursor: "pointer",
              width: "auto"
            }}
          >
            Logout
          </button>
        </div>

        {/* WELCOME SECTION */}
        <div className="welcome-section">
          <h2>
            Welcome, {user?.fullName || "Student"}! 💜
          </h2>

          <p>
            Let's make today productive and successful.
          </p>
        </div>

        {/* DASHBOARD STATISTICS */}
        <section className="stats">

          <div className="stat total">
            <h2>{tasks.length}</h2>
            <p>Total Tasks</p>
          </div>

          <div className="stat pending">
            <h2>{pending}</h2>
            <p>Pending Tasks</p>
          </div>

          <div className="stat progress">
            <h2>{inProgress}</h2>
            <p>In Progress</p>
          </div>

          <div className="stat completed">
            <h2>{completed}</h2>
            <p>Completed Tasks</p>
          </div>

        </section>

        {/* ADD / EDIT TASK */}
        <form onSubmit={handleSubmit} className="task-form">

          <h2>
            {editingId ? "✏️ Edit Task" : "✨ Add New Task"}
          </h2>

          <label>Task Title</label>

          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          <label>Description</label>

          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />

          <label>Priority</label>

          <select
            value={priority}
            onChange={e => setPriority(e.target.value)}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <label>Due Date</label>

          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />

          <div className="form-buttons">

            <button type="submit" className="add-btn">
              {editingId ? "Update Task" : "Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={clearForm}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

        {/* TASK LIST */}
        <section className="task-section">

          <h2>📋 My Tasks</h2>

          <div className="filters">

            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filterPriority}
              onChange={e => setFilterPriority(e.target.value)}
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

          </div>

          {loading && <p>Loading tasks...</p>}

          {error && (
            <p className="error">{error}</p>
          )}

          {!loading && !error && filteredTasks.length === 0 && (
            <p className="empty">
              No tasks found. Add your first task! ✨
            </p>
          )}

          <div className="task-grid">

            {filteredTasks.map(task => (

              <div className="task-card" key={task._id}>

                <div className="task-heading">

                  <h3>{task.title}</h3>

                  <span className={`priority ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>

                </div>

                <p>
                  {task.description || "No description provided."}
                </p>

                <p>
                  <strong>Status:</strong> {task.status}
                </p>

                <p>
                  <strong>Due Date:</strong>{" "}
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "Not set"}
                </p>

                <div className="task-buttons">

                  <button
                    className="status-btn"
                    onClick={() => updateStatus(task)}
                  >
                    Change Status
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => editTask(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

      </main>
    </div>
  );
}

export default Tasks;
