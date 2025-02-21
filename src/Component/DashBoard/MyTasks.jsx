import React, { useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { v4 as uuidv4 } from 'uuid';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ItemType = 'TASK';

const Task = ({ task, index, column, moveTask, editTask, deleteTask }) => {
  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { task, index, column },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`task bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer transition-all hover:bg-gray-100 ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      {task.type === 'text' ? (
        <input
          type="text"
          className="border-none focus:ring-0 w-full text-lg text-gray-700"
          value={task?.text || ''}
          onChange={(e) => editTask(column, index, e.target.value)}
        />
      ) : (
        <img src={task.imageUrl} alt="task" className="w-16 h-16 object-cover rounded-md" />
      )}
      <button
        className="text-red-500 text-xl"
        onClick={() => deleteTask(column, index)}
      >
        ❌
      </button>
    </div>
  );
};

const Column = ({ column, tasks = [], moveTask, addTask, editTask, deleteTask }) => {
  const [, drop] = useDrop({
    accept: ItemType,
    drop: (draggedTask) => moveTask(draggedTask.column, draggedTask.index, column),
  });

  return (
    <div
      ref={drop}
      className="column w-full max-w-sm bg-[#f3f4f6] border p-5 rounded-xl shadow-xl space-y-6"
    >
      <h3 className="text-2xl font-semibold text-gray-800">{column}</h3>
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
  const [columns, setColumns] = useState({
    'To-Do': [],
    'In Progress': [],
    'Done': [],
  });

  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskImage, setNewTaskImage] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const moveTask = (fromColumn, fromIndex, toColumn) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      if (!newColumns[fromColumn] || !newColumns[fromColumn][fromIndex]) {
        return prev;
      }
      const [movedTask] = newColumns[fromColumn].splice(fromIndex, 1);
      newColumns[toColumn] = [...(newColumns[toColumn] || []), movedTask];
      return { ...newColumns };
    });
  };

  const addTask = (type, content) => {
    const newTask = {
      id: uuidv4(),
      type,
      ...(type === 'text' ? { text: content } : { imageUrl: content }),
    };
    setColumns((prev) => ({
      ...prev,
      'To-Do': [...prev['To-Do'], newTask],
    }));
  };

  const editTask = (column, index, newText) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      if (newColumns[column][index]) {
        newColumns[column][index].text = newText;
      }
      return newColumns;
    });
  };

  const deleteTask = (column, index) => {
    setColumns((prev) => {
      const newColumns = { ...prev };
      newColumns[column].splice(index, 1);
      return newColumns;
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewTaskImage(reader.result);
        addTask('image', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="board gap-6 w-full min-h-screen bg-red-50">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">Task Management</h2>
        <div className="justify-center items-center input-section w-full lg:flex  gap-4 mb-8">
          
         <div>
         <Calendar onChange={setSelectedDate} value={selectedDate} className="mb-4" />
         </div>
         <div className=''>
           {/* input 1 */}
           <div className="lg:flex gap-4 items-center">
    
    <input
      type="text"
      className="border p-2 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
      placeholder="Enter a new task"
      value={newTaskText}
      onChange={(e) => setNewTaskText(e.target.value)}
    />
    <button
      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600"
      onClick={() => {
        if (newTaskText.trim()) {
          addTask('text', newTaskText);
          setNewTaskText('');
        }
      }}
    >
      Add Task
    </button>
  </div>
{/* input 2  */}
<div className="lg:flex gap-4 mt-3">
    <input type="file" accept="image" className="border  rounded-lg" onChange={handleImageUpload} />
    <button className="bg-purple-600 text-white p-2 rounded-lg">Add Image</button>
  </div>
         </div>
         
          
        </div>
        
        <div className="columns w-full lg:flex gap-8 justify-between">
          {Object.keys(columns).map((column) => (
            <Column key={column} column={column} tasks={columns[column]} moveTask={moveTask} addTask={addTask} editTask={editTask} deleteTask={deleteTask} />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default MyTasks
