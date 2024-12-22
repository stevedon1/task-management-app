"use client"
import React from 'react';

interface Task {
  title: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

const TaskCard: React.FC<{ task: Task }> = ({ task }) => {
  // Function to format the date
  const formatDate = (date: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  // Status color map
  const statusColors: { [key: string]: string } = {
    "in-progress": "bg-yellow-500",
    "completed": "bg-green-500",
    "pending": "bg-red-500",
  };

  // Priority color map
  const priorityColors: { [key: string]: string } = {
    "high": "bg-red-600",
    "medium": "bg-yellow-500",
    "low": "bg-green-500",
  };

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h3 className="text-xl font-bold">{task.title}</h3>
        <p className="text-gray-500">{task.description}</p>
        <div className="mt-4">
          <div className={`inline-block px-3 py-1 text-sm font-semibold text-white rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </div>
          <div className={`inline-block ml-2 px-3 py-1 text-sm font-semibold text-white rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          <p>Due Date: {formatDate(task.dueDate)}</p>
          <p>Created: {formatDate(task.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
