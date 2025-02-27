import { useNavigate } from "react-router-dom";  // Import the useNavigate hook
import { AuthContext } from "../Authentication/AuthProvider";
import { useContext, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Import Calendar CSS
import { FaArrowRight, FaCalendarAlt, FaTasks } from "react-icons/fa";
import Swal from "sweetalert2";
const AddTasks = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();  // Initialize navigate function

  // State for toggling calendar visibility and storing task data
  const [showCalendar, setShowCalendar] = useState(false);
  const [task, setTask] = useState({
    email: user?.email || "", // Use authenticated user's email
    title: "",
    description: "",
    category: "To-Do", // Default category set to "To-Do"
    completionDate: new Date().toISOString().split("T")[0], // Default to today's date
    completionTime: new Date().toLocaleTimeString("en-US", { hour12: false }), // Default to current time
  });

  // Handle input changes for all form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevState) => ({
      ...prevState,
      [name]: value, // Dynamically update the task field
    }));
  };

  // Handle calendar date change and update state with the selected date
  const handleDateChange = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Format date to yyyy-mm-dd
    setTask((prevState) => ({
      ...prevState,
      completionDate: formattedDate, // Set the selected date
      completionTime: new Date().toLocaleTimeString("en-US", { hour12: false }), // Reset time to current
    }));
    setShowCalendar(false); // Close the calendar after selecting a date
  };

  // Handle form submission to save task to MongoDB
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    console.log("Submitted Task Data:", task); // Debugging: Log the task data before submission

    try {
      const response = await fetch("http://localhost:5000/allTasks", {
        method: "POST", // POST request to the server to save the task
        headers: {
          "Content-Type": "application/json", // Sending JSON data
        },
        body: JSON.stringify(task), // Convert task object to JSON
      });

      if (response.ok) {
        Swal.fire({
          title: "Success!",
          text: "Task added successfully!", // Success alert
          icon: "success",
          confirmButtonText: "OK",
        });

        // Reset form after success
        setTask({
          email: user?.email || "",
          title: "",
          description: "",
          category: "To-Do", // Reset category to "To-Do"
          completionDate: new Date().toISOString().split("T")[0], // Reset to current date
          completionTime: new Date().toLocaleTimeString("en-US", { hour12: false }), // Reset to current time
        });

        // Navigate to 'Dashboard/MyTasks2' after success
        navigate("/Dashboard/MyTasks2");
      } else {
        Swal.fire({
          title: "Error!",
          text: "Failed to add task", // Error alert
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Error:", error); // Log any errors during the fetch request
      Swal.fire({
        title: "Oops!",
        text: "Something went wrong!", // Generic error alert
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
<div className=" bg-pink-200 h-screen">
<div className="max-w-3xl mx-auto bg-purple-200 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold  bg-gradient-to-l from-pink-800 to-[#23085a] text-white  py-3 px-4 rounded-t-lg flex items-center">
        <FaTasks className="mr-2" /> Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="p-4 space-y-4 text-black">
        {/* Title Input */}
        <div>
          <label className="block font-medium ">Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>

        {/* Description Textarea */}
        <div>
          <label className="block font-medium ">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            placeholder="Write a brief description..."
            className="w-full p-2 border rounded-md text-black"
          />
        </div>

        {/* Category Selection Dropdown */}
        <div className="grid grid-cols-2 gap-5">
          <div className="relative mb-4">
            <label>Category</label>
            <select
              name="category"
              className="select select-bordered w-full "
              value={task.category} // Bind the selected category to state
              onChange={handleChange} // Ensure onChange updates the category
              required
            >
              <option value="To-Do">To-Do</option>
              <option value="In-progress">In-Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
        </div>

        {/* Task Completion Date & Time Picker */}
        <div className="relative">
          <label className="block font-medium ">
            Task Completion Date & Time
          </label>
          <div className="relative">
            <input
              type="date"
              name="completionDate"
              value={task.completionDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-md cursor-pointer"
            />
            <FaCalendarAlt
              className="absolute right-3 top-3  cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)} // Toggle calendar visibility
            />
          </div>

          {showCalendar && (
            <div className="absolute z-10 bg-white shadow-lg rounded-lg mt-2">
              <Calendar
                onChange={handleDateChange}
                value={new Date(task.completionDate)} // Pass current completion date to calendar
              />
            </div>
          )}

          {/* Time Picker */}
          <input
            type="time"
            name="completionTime"
            value={task.completionTime}
            onChange={handleChange}
            className="w-full p-2 mt-2 border rounded-md cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full items-center border-2  rounded-full bg-[#23085a] text-white shadow-xl transition btn duration-300 py-6"
        >
          Add Task 
        </button>
      </form>
    </div>
</div>
  );
};

export default AddTasks;
