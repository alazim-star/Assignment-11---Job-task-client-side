import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import {FaClock, FaTasks, FaTrash } from 'react-icons/fa';
import { MdOutlineSubtitles } from "react-icons/md";
import { LuNotebookText } from "react-icons/lu";
const ItemType = 'TASK';

const Task = ({ task, index, column, moveTask, editTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { task, index, column },
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  return (
    <div
      ref={drag}
      className={`task p-4 rounded-lg shadow-md flex items-center justify-between cursor-pointer transition-all hover:bg-gray-100 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center gap-3">
    
        <div className=''>
       <div className='flex gap-2 items-center'>
       <MdOutlineSubtitles  className="text-purple-700 text-xl" />
        <p className='underline'>  Title:</p> <input
            type="text"
            className="border-none focus:ring-0 w-full text-lg text-gray-700"
            value={task.text || ''}
            onChange={(e) => editTask(column, index, e.target.value)}
            maxLength={50}
            placeholder="Task title"
          />
       </div>
     <div className='flex gap-2'><LuNotebookText  className='text-purple-700 text-xl  '/>
    <p className='underline'> Description:</p> {task.description && (
          <textarea
              className="border-none focus:ring-0 w-full text-gray-600"
              value={task.description}
              onChange={(e) => editTask(column, index, e.target.value, 'description')}
              maxLength={200}
              placeholder="Task description"
            />
          )}
     </div>
          <p className="text-sm text-purple-800 flex items-center gap-1">
            <FaClock /> {task.time}
          </p>
        </div>
      </div>
      <button className="text-purple-800 text-xl" onClick={() => deleteTask(column, index)}>
<FaTrash></FaTrash>
      </button>
    </div>
  );
};

const Column = ({ column, tasks = [], moveTask, editTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedTask) => moveTask(draggedTask.column, draggedTask.index, column),
  });

  return (
    <div ref={drop} className="column w-full max-w-sm bg-red-50 border p-5 rounded-xl space-y-6">
      <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
        <FaTasks className="text-purple-800" /> {column}
      </h3>
      <div className="space-y-3">
        {tasks.map((task, index) => (
          <Task
            key={task?.id || index}
            task={task}
            index={index}
            column={column}
            moveTask={moveTask}
            editTask={editTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
    </div>
  );
};

const MyTasks = () => {
  const [columns, setColumns] = useState({ 'To-Do': [], 'In Progress': [], 'Done': [] });
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const moveTask = (fromColumn, fromIndex, toColumn) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      const [movedTask] = newColumns[fromColumn].splice(fromIndex, 1);
      newColumns[toColumn] = [...(newColumns[toColumn] || []), movedTask];
      return { ...newColumns };
    });
  };

  const addTask = async () => {
    if (!newTaskText.trim()) return;

    const newTask = {
      text: newTaskText,
      description: newTaskDescription,
      date: selectedDate.toISOString(),
      time: new Date().toLocaleString(),
    };

    setColumns((prev) => ({ ...prev, 'To-Do': [...prev['To-Do'], newTask] }));
    setNewTaskText('');
    setNewTaskDescription('');
    setIsSubmitting(true);
    try {
      await fetch('https://assignment-11-job-task-server-side.vercel.app/allTasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
    
    } finally {
      setIsSubmitting(false);
    }
  };

  const editTask = (column, index, newText, field = 'text') => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      if (newColumns[column] && newColumns[column][index]) {
        newColumns[column][index][field] = newText;
      }
      return { ...newColumns };
    });
  };

  const deleteTask = (column, index) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[column].splice(index, 1);
      return newColumns;
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board  w-full min-h-screen  ">
        <h2 className="text-3xl font-bold text-center text-purple-800 mb-4">My Work</h2>

          <div className="divider divider-primary"></div>
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-center">
          <Calendar onChange={setSelectedDate} value={selectedDate} className="mb-4 text-purple-500" />
          <div className="lg:flex gap-4">
            <input type="text" className="border p-2 rounded-lg" placeholder="Task Title" value={newTaskText} onChange={(e) => setNewTaskText(e.target.value)} />
            <input type="text" className="border p-2 rounded-lg" placeholder="Task Description" value={newTaskDescription} onChange={(e) => setNewTaskDescription(e.target.value)} />
            <button className="bg-purple-800 text-white p-2 rounded-lg" onClick={addTask} disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </button>
          </div>
        </div>
        <div className="columns  lg:flex  gap-5 mt-6">
          {Object.keys(columns).map((column) => (
            <Column key={column} column={column} tasks={columns[column]} moveTask={moveTask} editTask={editTask} deleteTask={deleteTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default MyTasks;