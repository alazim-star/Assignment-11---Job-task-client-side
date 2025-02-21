import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { createSwapy } from "swapy";
import "./style.css";

const Example = ({ userEmail }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [showForm, setShowForm] = useState(false);
  const containerRef = useRef(null);
  const swapyInstance = useRef(null);

  // 🔄 Fetch Tasks
  useEffect(() => {
    axios
      .get(`http://localhost:5000/tasks?userEmail=${userEmail}`)
      .then((response) => setTasks(response.data))
      .catch((error) => console.error(error));
  }, [userEmail]);

  // 🆕 Add New Task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    const taskData = {
      title: newTask.title,
      description: newTask.description,
      category: "To-Do",
      userEmail,
    };
    const response = await axios.post("http://localhost:5000/tasks", taskData);

    setTasks([...tasks, response.data]);
    setNewTask({ title: "", description: "" });
    setShowForm(false);
  };

  // 🚀 Update Task Category after Swap
  const updateTaskCategory = async (taskId, newCategory) => {
    await axios.put(`http://localhost:5000/tasks/${taskId}`, { category: newCategory });
    setTasks(tasks.map((task) => (task._id === taskId ? { ...task, category: newCategory } : task)));
  };

  // 🗑 Delete Task
  const deleteTask = async (taskId) => {
    await axios.delete(`http://localhost:5000/tasks/${taskId}`);
    setTasks(tasks.filter((task) => task._id !== taskId));
  };

  // 🔄 Initialize Swapy for Drag-and-Drop
  useEffect(() => {
    if (containerRef.current) {
      if (swapyInstance.current) {
        swapyInstance.current.destroy(); // Destroy previous instance before creating a new one
      }

      swapyInstance.current = createSwapy(containerRef.current, {});

      swapyInstance.current.onSwap((event) => {
        const draggedItem = event.draggedItem;
        const newSlot = event.newSlot;

        if (draggedItem && newSlot) {
          const draggedTaskId = draggedItem.getAttribute("data-task-id");
          const newCategory = newSlot.getAttribute("data-swapy-slot");

          if (draggedTaskId && newCategory) {
            updateTaskCategory(draggedTaskId, newCategory);
          }
        }
      });
    }

    return () => swapyInstance.current?.destroy(); // Cleanup on unmount
  }, [tasks]); // Reinitialize Swapy when tasks update

  return (
    <div className="container" ref={containerRef}>
      {/* Add Task Button */}
      <button onClick={() => setShowForm(true)} className="add-task-btn">
        + Add Task
      </button>

      {/* Task Input Form */}
      {showForm && (
        <form onSubmit={handleAddTask} className="task-form">
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Task Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          />
          <button type="submit">Add</button>
          <button type="button" onClick={() => setShowForm(false)}>
            Cancel
          </button>
        </form>
      )}

      {/* Task Categories */}
      {["To-Do", "In Progress", "Done"].map((category) => (
        <div className="slot" key={category} data-swapy-slot={category}>
          {tasks
            .filter((task) => task.category === category)
            .map((task) => (
              <div
                className="item"
                key={task._id}
                data-task-id={task._id}
                data-swapy-item={task._id}
              >
                <div>{task.title}</div>
                <button onClick={() => deleteTask(task._id)}>🗑</button>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
};

export default Example;
