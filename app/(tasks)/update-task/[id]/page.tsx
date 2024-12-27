"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
}

const UpdateTaskPage = () => {
  const router = useRouter();
  const { id: taskId } = useParams(); // Get taskId from URL params

  const [task, setTask] = useState<Task | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(true); // Loading state to show when data is fetching
  const [error, setError] = useState(""); // Error handling

  // Fetch task details
  useEffect(() => {
    const fetchTask = async () => {
      if (!taskId) return;

      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view or update a task.");
          setLoading(false);
          return;
        }

        const response = await fetch(`https://task-management-api-52oc.onrender.com/api/tasks/${taskId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          const data = result.data; // Access the task object inside 'data'
          setTask(data);
          setTitle(data.title);
          setDescription(data.description);
          setStatus(data.status);
          setPriority(data.priority);
          setDueDate(data.dueDate); // Don't forget to set the dueDate
        } else {
          setError("Failed to fetch task.");
        }
      } catch (error) {
        setError("Error fetching task.");
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false after the fetch completes
      }
    };

    fetchTask();
  }, [taskId]);

  // Handle task update
  const handleUpdate = async () => {
    if (!taskId) return;

    const updatedTask = {
      title,
      description,
      status,
      priority,
      dueDate,
    };

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update a task.");
        return;
      }

      const response = await fetch(`https://task-management-api-52oc.onrender.com/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTask),
      });

      if (response.ok) {
        alert("Task updated successfully!");
        router.push("/"); // Redirect to task list
      } else {
        setError("Failed to update task.");
      }
    } catch (error) {
      setError("Error updating task.");
      console.error(error);
    }
  };

  // Show loading spinner, error, or form based on state
  if (loading) return <div className="text-center">Loading...</div>;

  if (error) return <div className="text-center text-red-500">{error}</div>;

  if (!task) return <p>Failed to load task.</p>;

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold text-indigo-600 mb-4">Update Task</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          className="w-full p-2 border rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full p-2 border rounded-md"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          className="w-full p-2 border rounded-md"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          className="w-full p-2 border rounded-md"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded-md"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>
      <button
        onClick={handleUpdate}
        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
      >
        Update Task
      </button>
    </div>
  );
};

export default UpdateTaskPage;
