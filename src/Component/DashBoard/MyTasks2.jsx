import React, { useContext, useEffect, useState } from 'react'; // Import React and hooks
import { CiStopwatch, CiCalendarDate, CiEdit } from "react-icons/ci"; // Import icons for stopwatch, calendar, and edit
import { RiDeleteBin6Line } from "react-icons/ri"; // Import delete bin icon
import Swal from 'sweetalert2'; // Import SweetAlert2 for alerts
import axios from 'axios'; // Import axios for making HTTP requests
import { AuthContext } from './../Authentication/AuthProvider'; // Import AuthContext to get the logged-in user's data
import { DndProvider, useDrag, useDrop } from 'react-dnd'; // Import drag-and-drop hooks
import { HTML5Backend } from 'react-dnd-html5-backend'; // Import HTML5 backend for drag-and-drop functionality

// Define item types for drag and drop
const ItemTypes = {
  TASK: 'task',
};

const MyTasks2 = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] }); // State to hold tasks categorized by status
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [modalVisible, setModalVisible] = useState(false); // State to control the visibility of the modal
  const [editedTask, setEditedTask] = useState({ title: '', description: '', completionDate: '', completionTime: '' }); // State to store edited task data

  // Function to check if a task is overdue or due soon
  const getDueDateClass = (completionDate) => {
    const dueDate = new Date(completionDate);
    const currentDate = new Date();

    // Overdue tasks
    if (dueDate < currentDate) {
      return 'text-red-500'; // Red for overdue
    }

    // Tasks that are due in the next 2 days
    const timeDifference = dueDate - currentDate;
    if (timeDifference <= 2 * 24 * 60 * 60 * 1000) {
      return 'text-yellow-500'; // Yellow for due soon
    }

    return 'text-green-500'; // Green for on time
  };

  // Fetch tasks from the server based on the logged-in user's email
  const fetchAllTasks = async () => {
    setLoading(true); // Set loading state to true
    try {
      const userEmail = user?.email; // Get user email from AuthContext
      if (!userEmail) { // If user is not authenticated, show error
        Swal.fire('Error', 'User is not authenticated', 'error');
        return;
      }

      const response = await axios.get(`http://localhost:5000/allTasks/${userEmail}`); // Send GET request to fetch tasks
      if (response.status === 200) { // If response is successful
        setTasks({
          todo: response.data.filter(task => task.category.toLowerCase() === 'to-do'), // Set tasks in "to-do" category
          inProgress: response.data.filter(task => task.category.toLowerCase() === 'in-progress'), // Set tasks in "in-progress" category
          done: response.data.filter(task => task.category.toLowerCase() === 'done'), // Set tasks in "done" category
        });
      } else { // If no tasks found, set empty task lists
        setTasks({ todo: [], inProgress: [], done: [] });
      }
    } catch (error) { // Handle any error that occurs during the fetch
      Swal.fire("Error", "Failed to fetch tasks", "error");
    } finally {
      setLoading(false); // Set loading state to false after fetching
    }
  };

  // UseEffect to fetch tasks whenever user email is available
  useEffect(() => {
    if (user?.email) { // Only fetch tasks if user is authenticated
      fetchAllTasks();
    }
  }, [user?.email]); // Dependency array ensures it runs when the user email changes

  // Function to delete a task
  const deleteTask = async (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) { // If user confirms deletion
        try {
          await axios.delete(`http://localhost:5000/allTasks/${taskId}`); // Send DELETE request to remove the task
          fetchAllTasks(); // Refresh task list after deletion
          Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        } catch (error) { // Handle error during task deletion
          Swal.fire('Error', 'Failed to delete the task', 'error');
        }
      }
    });
  };

  // Function to edit a task
  const editTask = (task) => {
    setEditedTask({ ...task }); // Set the current task data to the editedTask state
    setModalVisible(true); // Open the modal to edit the task
  };

  // Function to save the edited task
  const saveTask = async () => {
    try {
      await axios.put(`http://localhost:5000/allTasks/${editedTask._id}`, editedTask); // Send PUT request to update the task
      setModalVisible(false); // Close the modal after saving
      fetchAllTasks(); // Refresh tasks after saving
      Swal.fire("Success!", "Task updated successfully.", "success");
    } catch (error) { // Handle error during saving task
      Swal.fire("Error!", "Failed to save task. Try again!", "error");
    }
  };

  // Handle form input changes during task editing
  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value }); // Update edited task state
  };

  // Function to handle task movement during drag-and-drop
  const moveTask = async (taskId, newCategory) => {
    try {
      // Send PUT request to update the task's category
      await axios.put(`http://localhost:5000/allTasks/${taskId}`, { category: newCategory });
      fetchAllTasks(); // Refresh tasks after moving
    } catch (error) { // Handle error during task movement
      Swal.fire("Error!", "Failed to move task.", "error");
    }
  };

  // TaskCard component to render each task
  const TaskCard = ({ task }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.TASK, // Drag type is a task
      item: { id: task._id, category: task.category }, // Data to be dragged
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(), // Collect dragging state
      }),
    });

    return (
      <div
        ref={drag} // Attach drag behavior
        className={`p-3 mb-3 
          ${task.category.toLowerCase() === 'to-do' ? 'bg-purple-100'  // Purple for To-Do
            : task.category.toLowerCase() === 'in-progress' ? 'bg-blue-100' // Blue for In Progress
            : task.category.toLowerCase() === 'done' ? 'bg-green-100' : ''} 
          shadow flex justify-between ${isDragging ? 'opacity-50' : ''}`} 
      >
        <div>
          <h4 className="font-semibold">Title : {task.title}</h4>
          <p>Description : {task.description}</p>
       
          <p>Category : {task.category}</p>
          <div className="lg:flex lg:ml-20 gap-3 text-sm">
            <p className="flex items-center gap-1"><CiCalendarDate /> 
              <span className={getDueDateClass(task.completionDate)}>
                {task.completionDate}
              </span>
            </p>
            <p className="flex items-center gap-1"><CiStopwatch /> {task.completionTime}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button onClick={() => editTask(task)} className="text-blue-600 hover:text-blue-800"><CiEdit /></button>
          <button onClick={() => deleteTask(task._id)} className="text-red-600 hover:text-red-800"><RiDeleteBin6Line /></button>
        </div>
      </div>
    );
  };

  // DropZone component to handle drag-and-drop area for each category
  const DropZone = ({ category }) => {
    const [, drop] = useDrop({
      accept: ItemTypes.TASK, // Accept tasks as draggable items
      drop: (item) => {
        // Move the task to the new category when dropped
        if (item.category !== category) {
          moveTask(item.id, category);
        }
      },
    });

    return (
      <div ref={drop} className="bg-pink-200 p-4 rounded-lg min-h-[200px]">
        <h2 className="text-center font-bold text-2xl capitalize">{category}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : tasks[category]?.length ? (
          tasks[category].map((task) => <TaskCard key={task._id} task={task} />) // Map over tasks in the category and render each TaskCard
        ) : (
          <p>No tasks in this category</p>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}> {/* Wrap the app in DndProvider for drag-and-drop context */}
      <div className="p-5 grid lg:grid-cols-3 md:grid-cols-2 gap-5 text-black">
        {['todo', 'inProgress', 'done'].map((category) => (
          <DropZone key={category} category={category} /> // Render DropZone for each category
        ))}
      </div>

      {/* Edit Task Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-opacity-50">
          <div className="bg-purple-200 p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={(e) => { e.preventDefault(); saveTask(); }}>
              <input type="text" 
                name="title" 
                value={editedTask.title} 
                onChange={handleChange} 
                className="w-full border p-2 mb-2" />
              <textarea name="description" 
                value={editedTask.description} 
                onChange={handleChange} 
                className="w-full border p-2 mb-2"></textarea>
              <input type="date" name="completionDate" 
                value={editedTask.completionDate} 
                onChange={handleChange}
                className="w-full border p-2 mb-2" />
              <input type="time" name="completionTime" 
                value={editedTask.completionTime} 
                onChange={handleChange} 
                className="w-full border p-2 mb-2" />
              <div className="flex justify-between">
                <button type="button" 
                  onClick={() => setModalVisible(false)} className="px-10 py-3 border-2 border-primary rounded-full hover:bg-primary hover:text-white shadow-xl transition duration-300">Cancel</button>
                <button type="submit" 
                  className="px-10 py-3 rounded-full bg-primary text-white shadow-xl transition duration-300 hover:bg-pink-500">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DndProvider>
  );
};

export default MyTasks2;
