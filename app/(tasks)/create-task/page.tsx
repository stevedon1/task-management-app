"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateTaskPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("in-progress");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!title || !description || !dueDate) {
      setError("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true); // Disable the form while submitting

    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to create a task.");
        setIsSubmitting(false);
        return;
      }

      // Prepare the task data to be sent
      const taskData = {
        title,
        description,
        status,
        priority,
        dueDate,
      };

      // Make the POST request to create the task
      const response = await fetch("https://task-management-api-52oc.onrender.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach the token to the request
        },
        body: JSON.stringify(taskData),
      });

      if (!response.ok) {
        throw new Error("Failed to create the task.");
      }

      // Redirect to the dashboard after successful task creation
      router.push("/");
    } catch (error) {
      setError("There was an issue creating the task. Please try again.");
      console.error(error);
    } finally {
      setIsSubmitting(false); // Enable the form again after submission
    }
  };

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Create New Task</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-black p-2 border rounded"
            placeholder="Task Title"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-black p-2 border rounded"
            placeholder="Task Description"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full text-black p-2 border rounded"
            >
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium">
              Priority
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full text-black p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            required
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full text-black p-2 border rounded"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white p-2 rounded disabled:bg-blue-300"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}
