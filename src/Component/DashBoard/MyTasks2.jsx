import React, { useEffect, useState } from 'react';
import { CiStopwatch, CiCalendarDate, CiEdit } from "react-icons/ci";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from 'sweetalert2';

const MyTasks2 = () => {
  const [todoTasks, setTodoTasks] = useState([]);
  const [inProgressTasks, setInProgressTasks] = useState([]);
  const [doneTasks, setDoneTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedTask, setEditedTask] = useState({ title: '', description: '', completionDate: '', completionTime: '' });
  const [error, setError] = useState(null);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const categories = ['To-Do', 'In-progress', 'Done'];
      const responses = await Promise.all(
        categories.map(category => fetch(`http://localhost:5000/allTasks/category/${category}`).then(res => res.json()))
      );

      setTodoTasks(responses[0]);
      setInProgressTasks(responses[1]);
      setDoneTasks(responses[2]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setError('Failed to fetch tasks. Please try again later.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const deleteTask = async (taskId, category) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/allTasks/${taskId}`, { method: 'DELETE' });
          const data = await res.json();
          if (data.deletedCount > 0) {
            Swal.fire('Deleted!', 'The task has been deleted.', 'success');
            // Update state after deletion
            if (category === 'To-Do') setTodoTasks(prev => prev.filter(task => task._id !== taskId));
            if (category === 'In-progress') setInProgressTasks(prev => prev.filter(task => task._id !== taskId));
            if (category === 'Done') setDoneTasks(prev => prev.filter(task => task._id !== taskId));
          }
        } catch (err) {
          Swal.fire('Error', 'Failed to delete the task', 'error');
          console.error('Error deleting task:', err);
        }
      }
    });
  };

  const editTask = (task) => {
    setSelectedTask(task);
    setEditedTask({ ...task });
    setModalVisible(true);
  };

  const saveTask = async (updatedTask) => {
    try {
      await fetch(`http://localhost:5000/allTasks/${updatedTask._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask),
      });

      setTodoTasks(todoTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
      setInProgressTasks(inProgressTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
      setDoneTasks(doneTasks.map(task => task._id === updatedTask._id ? updatedTask : task));

      setModalVisible(false);
      Swal.fire("Success!", "Task updated successfully.", "success");
    } catch (error) {
      Swal.fire("Error!", "Failed to save task. Try again!", "error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveTask(editedTask);
  };

  const getCurrentDateAndTime = () => {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const time = now.toLocaleTimeString('en-US', { hour12: false });
    return { date, time };
  };

  useEffect(() => {
    if (modalVisible) {
      const { date, time } = getCurrentDateAndTime();
      setEditedTask((prev) => ({
        ...prev,
        completionDate: date,
        completionTime: time,
      }));
    }
  }, [modalVisible]);

  return (
    <div className="p-5 grid grid-cols-3 gap-5">
      {error && <div className="bg-red-500 text-white p-3 rounded">{error}</div>}
  
      {/* To-Do Tasks */}
      <div className="bg-red-50 p-4 rounded-lg">
        <h2 className="text-center font-bold text-3xl">To-Do</h2>
        {loading ? (
          <p>Loading...</p>
        ) : todoTasks.length ? (
          todoTasks.map((task) => (
            <div key={task._id} className="p-3 mb-3 bg-red-200 flex justify-between">
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p>{task.description}</p>
                <div className="flex gap-3">
                  <p className="flex items-center gap-1"><CiCalendarDate />{task.completionDate}</p>
                  <p className="flex items-center gap-1"><CiStopwatch />{task.completionTime}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => editTask(task)} className="px-2 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white shadow-xl transition duration-300">
                  <CiEdit />
                </button>
                <button onClick={() => deleteTask(task._id, 'To-Do')} className="bg-pink-600 px-2 text-white py-2 rounded-full">
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks in this category</p>
        )}
      </div>
  
      {/* In-progress Tasks */}
      <div className="bg-purple-100 p-4 rounded-lg ">
        <h2 className="text-center font-bold text-3xl">In-progress</h2>
        {loading ? (
          <p>Loading...</p>
        ) : inProgressTasks.length ? (
          inProgressTasks.map((task) => (
            <div key={task._id} className="p-3 mb-3 bg-purple-200 flex justify-between">
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p>{task.description}</p>
                <div className="flex gap-3">
                  <p className="flex items-center gap-1"><CiCalendarDate />{task.completionDate}</p>
                  <p className="flex items-center gap-1"><CiStopwatch />{task.completionTime}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => editTask(task)} className="px-2 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white shadow-xl transition duration-300">
                  <CiEdit />
                </button>
                <button onClick={() => deleteTask(task._id, 'In-progress')} className="bg-pink-600 px-2 text-white py-2 rounded-full">
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks in this category</p>
        )}
      </div>
  
      {/* Done Tasks */}
      <div className="bg-green-100 p-4 rounded-lg">
        <h2 className="text-center font-bold text-3xl">Done</h2>
        {loading ? (
          <p>Loading...</p>
        ) : doneTasks.length ? (
          doneTasks.map((task) => (
            <div key={task._id} className="p-3 mb-3 bg-green-200 flex justify-between">
              <div>
                <h4 className="font-semibold">{task.title}</h4>
                <p>{task.description}</p>
                <div className="flex gap-3">
                  <p className="flex items-center gap-1"><CiCalendarDate />{task.completionDate}</p>
                  <p className="flex items-center gap-1"><CiStopwatch />{task.completionTime}</p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => editTask(task)} className="px-2 py-2 border-2 border-primary text-primary rounded-full hover:bg-primary hover:text-white shadow-xl transition duration-300">
                  <CiEdit />
                </button>
                <button onClick={() => deleteTask(task._id, 'Done')} className="bg-pink-600 px-2 text-white py-2 rounded-full">
                  <RiDeleteBin6Line />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks in this category</p>
        )}
      </div>
  
      {/* Modal for editing task */}
      {modalVisible && (
        <div className="fixed inset-0 flex justify-center items-center text-white bg-opacity-50 z-50">
          <div className="bg-gradient-to-l from-pink-800 to-[#23085a] p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block">Title</label>
                <input
                  type="text"
                  name="title"
                  value={editedTask.title}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block">Description</label>
                <textarea
                  name="description"
                  value={editedTask.description}
                  onChange={handleChange}
                  className="w-full border p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block">Completion Date</label>
                <input
                  type="date"
                  name="completionDate"
                  value={editedTask.completionDate}
                  onChange={handleChange}
                  className="w-full border p-2 text-white"
                />
              </div>
  
              <div className="mb-4">
                <label className="block">Completion Time</label>
                <input
                  type="time"
                  name="completionTime"
                  value={editedTask.completionTime}
                  onChange={handleChange}
                  className="w-full border p-2 text-white"
                />
              </div>
  
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setModalVisible(false)}
                  className="bg-pink-600 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 border-2 border-primary text-white rounded-full hover:bg-primary hover:text-white shadow-xl transition duration-300">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
export default MyTasks2;
