"use client";
import React from "react";
import { useRouter } from "next/navigation";

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

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onDelete: (taskId: string) => void; // Delete handler prop
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onDelete }) => {
  const router = useRouter();

  if (!task) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl text-indigo-700 font-semibold mb-4">
          {task.title}
        </h2>
        <p className="text-gray-800 text-xl mb-4">{task.description}</p>
        <div className="mb-4">
          <div
            className={`px-3 py-1 text-md font-bold rounded-full ${
              task.status === "completed"
                ? "text-green-700"
                : task.status === "in-progress"
                ? "text-yellow-700"
                : "text-red-700"
            }`}
          >
            <span className="text-black font-medium">Status:</span> {task.status}
          </div>
          <div
            className={`px-3 py-1 text-md font-bold rounded-full ${
              task.priority === "high"
                ? "text-red-700"
                : task.priority === "medium"
                ? "text-yellow-700"
                : "text-green-700"
            }`}
          >
            <span className="text-black font-medium">Priority:</span> {task.priority}
          </div>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          <span>Due date: {new Date(task.dueDate).toLocaleDateString()}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex justify-between space-x-4">
          <button
            onClick={() => router.push(`/update-task/${task._id}`)} // Redirect to update page
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update
          </button>
          <button
            onClick={() => onDelete(task._id)} // Trigger delete action
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={onClose} // Close modal
            className="border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-600 hover:text-white transition-colors w-full"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
