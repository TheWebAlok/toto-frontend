import React, { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Todo.css";

export default function Todo({ searchText }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ----------------------
  // Load Todos function
  // ----------------------
  const loadTodos = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/todos");
      setTodos(data);
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired! Login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error("Failed to load todos!");
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------------
  // Check login & load todos
  // ----------------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkLogin = async () => {
      if (!token) {
        toast.warning("Please login first!");
        navigate("/login");
      } else {
        await loadTodos();
      }
    };

    checkLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------
  // Add Todo
  // ----------------------
  const addTodo = async () => {
    if (!text.trim()) return toast.warning("Task can't be empty!");
    await API.post("/todos", { title: text });
    setText("");
    toast.success("Task added");
    loadTodos();
  };

  // ----------------------
  // Update Todo
  // ----------------------
  const updateTodo = async () => {
    if (!text.trim()) return toast.warning("Task can't be empty!");
    await API.put(`/todos/${editId}`, { title: text });
    setEditId(null);
    setText("");
    toast.success("Task updated");
    loadTodos();
  };

  // ----------------------
  // Toggle complete
  // ----------------------
  const toggleComplete = async (id, completed) => {
    await API.put(`/todos/${id}`, { completed: !completed });
    loadTodos();
  };

  // ----------------------
  // Delete todo
  // ----------------------
  const deleteTodo = async (id) => {
    await API.delete(`/todos/${id}`);
    toast.success("Task deleted");
    loadTodos();
  };

  // ----------------------
  // Form submit
  // ----------------------
  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? updateTodo() : addTodo();
  };

  // ----------------------
  // Logout
  // ----------------------
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out");
    navigate("/login");
  };

  // ----------------------
  // Filter todos
  // ----------------------
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchText?.toLowerCase())
  );

  return (
    <div className="todo-container">
      <div className="row">
        <div className="col-md-6">
          <div className="todo-header">
            <h2>My Todo App</h2>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {/* Input box */}
          <form className="todo-input-box" onSubmit={handleSubmit}>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter task..."
              autoComplete="off"
            />
            <button type="submit">{editId ? "Update" : "Add"}</button>
          </form>
        </div>

        {/* Todo List */}
        <div className="col-md-6">
          {loading && <p className="loading">Loading...</p>}

          <ul className="todo-list">
            {filteredTodos.length > 0 ? (
              filteredTodos.map((t) => (
                <li
                  key={t._id}
                  className={`todo-item ${t.completed ? "done" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleComplete(t._id, t.completed)}
                  />
                  <span>{t.title}</span>
                  <div>
                    <button
                      onClick={() => {
                        setEditId(t._id);
                        setText(t.title);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete"
                      onClick={() => deleteTodo(t._id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))
            ) : (
              <p>No tasks found...</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
