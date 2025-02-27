import React, { useEffect, useState } from 'react';
import { CiStopwatch, CiCalendarDate, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';

const MyTasks2 = () => {
  const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: '', description: '', completionDate: '', completionTime: '' });

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/allTasks');
      const data = await response.json();

      // ✅ Ensure category names match exactly with the backend response
      const categorizedTasks = {
        todo: data.filter(task => task.category.toLowerCase() === 'to-do'),
        inProgress: data.filter(task => task.category.toLowerCase() === 'in-progress'),
        done: data.filter(task => task.category.toLowerCase() === 'done')
      };

      setTasks(categorizedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      Swal.fire('Error', 'Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

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
          await fetch(`http://localhost:5000/allTasks/${taskId}`, { method: 'DELETE' });
          fetchAllTasks();
          Swal.fire('Deleted!', 'Task has been deleted.', 'success');
        } catch (error) {
          Swal.fire('Error', 'Failed to delete the task', 'error');
        }
      }
    });
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setModalVisible(true);
  };

  const saveTask = async () => {
    try {
      await fetch(`http://localhost:5000/allTasks/${editedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedTask),
      });
      setModalVisible(false);
      fetchAllTasks();
      Swal.fire("Success!", "Task updated successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to save task. Try again!", "error");
    }
  };

  const handleChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-5 grid grid-cols-3 gap-5">
      {['todo', 'inProgress', 'done'].map((category, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-center font-bold text-2xl">{category}</h2>
          {loading ? (
            <p>Loading...</p>
          ) : tasks[category]?.length ? ( // ✅ Corrected tasks access
            tasks[category].map((task) => (
              <div key={task._id} className="p-3 mb-3 bg-white shadow flex justify-between">
                <div>
                  <h4 className="font-semibold">{task.title}</h4>
                  <p>{task.description}</p>
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
