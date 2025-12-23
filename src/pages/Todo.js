import React, { useEffect, useState, useCallback } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Todo.css";

export default function Todo({ searchText }) {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  /* ======================
     LOAD TODOS
  ====================== */
  const loadTodos = useCallback(async () => {
    try {
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
  }, [navigate]);

  /* ======================
     AUTH CHECK
  ====================== */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.warning("Please login first!");
      navigate("/login");
      return;
    }

    loadTodos();
  }, [loadTodos, navigate]);

  /* ======================
     ADD / UPDATE TODO
  ====================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      return toast.warning("Task can't be empty!");
    }

    try {
      if (editId) {
        await API.put(`/todos/${editId}`, { title: text });
        toast.success("Task updated");
      } else {
        await API.post("/todos", { title: text });
        toast.success("Task added");
      }

      setText("");
      setEditId(null);
      loadTodos();
    } catch {
      toast.error("Action failed!");
    }
  };

  /* ======================
     TOGGLE COMPLETE
  ====================== */
  const toggleComplete = async (id, completed) => {
    try {
      await API.put(`/todos/${id}`, { completed: !completed });
      loadTodos();
    } catch {
      toast.error("Update failed!");
    }
  };

  /* ======================
     DELETE TODO
  ====================== */
  const deleteTodo = async (id) => {
    try {
      await API.delete(`/todos/${id}`);
      toast.success("Task deleted");
      loadTodos();
    } catch {
      toast.error("Delete failed!");
    }
  };

  /* ======================
     FILTER
  ====================== */
  const filteredTodos = todos.filter((todo) =>
    todo.title.toLowerCase().includes(searchText?.toLowerCase() || "")
  );

  /* ======================
     UI
  ====================== */
  return (
    <div className="todo-container">
      <div className="row">
        <div className="col-md-6">
          <div className="todo-header">
            <h2>My Todo App</h2>
          </div>

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

        <div className="col-md-6">
          {loading && <p className="loading">Loading...</p>}

          <ul className="todo-list">
            {filteredTodos.length ? (
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
