"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline"; // Importing the Heroicons plus-circle icon
import TaskModal from "./components/taskModal"; // Import the TaskModal component

export default function DashboardPage() {
  // Define Task type inline
  interface Task {
    _id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    user: string;
    createdAt: string;
    updatedAt: string;
  }

  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Selected task for modal
  const router = useRouter();

  // Fetch tasks
  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to view tasks.");
        return;
      }

      const response = await fetch("https://task-management-api-52oc.onrender.com/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        setTasks(data.data); // Correctly extract tasks from data.data
      } else {
        setError("Invalid response format: expected an array of tasks.");
      }
    } catch (error) {
      setError("There was an issue fetching tasks.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch tasks on page load
  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTaskClick = () => {
    router.push("/create-task");
  };

  const openModal = (task: Task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // Delete task logic
  const handleDeleteTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("You must be logged in to delete tasks.");
        return;
      }

      const response = await fetch(`https://task-management-api-52oc.onrender.com/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      // Update local state by filtering out the deleted task
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      closeModal(); // Close the modal after deleting the task
    } catch (error) {
      setError("There was an issue deleting the task.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">
          Keep Track of Your <span className="text-indigo-600">Tasks</span> Here!
        </h2>
        <Link
          href="/create-task"
          className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors"
        >
          <PlusCircleIcon className="h-8 w-8" />
        </Link>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {isLoading ? (
        <div className="text-lg text-gray-600">Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className="text-center mt-8">
          <p className="text-lg text-gray-700 mb-4">
            No tasks available. Start by creating a new task.
          </p>
          <Link
            href="/create-task"
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Task
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => {
            return (
              <div
                key={task._id}
                onClick={() => openModal(task)} // Open modal on task click
                className="bg-white p-6 border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <h3 className="text-2xl font-semibold">{task.title}</h3>
                <p className="text-sm text-gray-600 mt-2">{task.description}</p>
                <div className="flex justify-between mt-4">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      task.status === "completed"
                        ? "bg-green-200 text-green-700"
                        : task.status === "in-progress"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-red-200 text-red-700"
                    }`}
                  >
                    {task.status}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      task.priority === "high"
                        ? "bg-red-200 text-red-700"
                        : task.priority === "medium"
                        ? "bg-yellow-200 text-yellow-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-4">
                  <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && selectedTask && (
        <TaskModal task={selectedTask} onClose={closeModal} onDelete={handleDeleteTask} />
      )}
    </div>
  );
}
