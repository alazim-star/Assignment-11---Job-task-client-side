import React, { useContext, useEffect, useState } from 'react';
import { CiStopwatch, CiCalendarDate, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';
import axios from 'axios';
import { AuthContext } from './../Authentication/AuthProvider';

const MyTasks2 = () => {
  const { user } = useContext(AuthContext); // Get the logged-in user from AuthContext
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: '', description: '', completionDate: '', completionTime: '' });







  // Fetch tasks based on the logged-in user's email
  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const userEmail = user?.email; // Use email from AuthContext
      if (!userEmail) {
        Swal.fire('Error', 'User is not authenticated', 'error');
        return;
      }

      const response = await axios.get(`http://localhost:5000/allTasks/${userEmail}`);
      console.log(response.data); // Log the response data to see if tasks are returned

      if (response.status === 200) {
        setTasks({
          todo: response.data.filter(task => task.category.toLowerCase() === 'to-do'),
          inProgress: response.data.filter(task => task.category.toLowerCase() === 'in-progress'),
          done: response.data.filter(task => task.category.toLowerCase() === 'done'),
        });
      } else {
        setTasks({ todo: [], inProgress: [], done: [] });
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
      Swal.fire("Error", "Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchAllTasks();  // Fetch tasks when email is available
    }
  }, [user?.email]); // Re-fetch when the user email changes











  // Delete a task
  const deleteTask = async (taskId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/allTasks/${taskId}`);
          fetchAllTasks(); // Refresh tasks after deletion
          Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Failed to delete the task', 'error');
        }
      }
    });
  };

  // Edit a task
  const editTask = (task) => {
    setEditedTask({ ...task });
    setModalVisible(true);
  };

  // Save the edited task
  const saveTask = async () => {
    try {
      await axios.put(`http://localhost:5000/allTasks/${editedTask._id}`, editedTask);
      setModalVisible(false);
      fetchAllTasks(); // Refresh tasks after saving
      Swal.fire("Success!", "Task updated successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to save task. Try again!", "error");
    }
  };

  // Handle input changes in the edit form
  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-5 grid grid-cols-3 gap-5">
      {/* Render tasks for each category */}
      {['todo', 'inProgress', 'done'].map((category, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-center font-bold text-2xl capitalize">{category}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : tasks[category]?.length ? (
            tasks[category].map((task) => (
              <div key={task._id} className="p-3 mb-3 bg-white shadow flex justify-between">
                <div>
                  <h4 className="font-semibold">Title : {task.title}</h4>
                  <p>Description : {task.description}</p>
                  <p>Email : {task.email}</p>
                  <div className="flex gap-3 text-sm">
                    <p className="flex items-center gap-1"><CiCalendarDate /> {task.completionDate}</p>
                    <p className="flex items-center gap-1"><CiStopwatch /> {task.completionTime}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => editTask(task)} className="text-blue-600 hover:text-blue-800"><CiEdit /></button>
                  <button onClick={() => deleteTask(task._id)} className="text-red-600 hover:text-red-800"><RiDeleteBin6Line /></button>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks in this category</p>
          )}
        </div>
      ))}

      {/* Edit Task Modal */}
      {modalVisible && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={(e) => { e.preventDefault(); saveTask(); }}>
              <input type="text" name="title" value={editedTask.title} onChange={handleChange} className="w-full border p-2 mb-2" />
              <textarea name="description" value={editedTask.description} onChange={handleChange} className="w-full border p-2 mb-2"></textarea>
              <input type="date" name="completionDate" value={editedTask.completionDate} onChange={handleChange} className="w-full border p-2 mb-2" />
              <input type="time" name="completionTime" value={editedTask.completionTime} onChange={handleChange} className="w-full border p-2 mb-2" />
              <div className="flex justify-between">
                <button type="button" onClick={() => setModalVisible(false)} className="bg-gray-400 px-4 py-2 rounded">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks2;
