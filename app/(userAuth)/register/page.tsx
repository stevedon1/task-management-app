"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

export default function Register() {
  const router = useRouter(); // Initialize useRouter hook

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.values(newErrors).every((error) => error === "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Send data to your backend API
    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed.");
      }

      const data = await response.json();
      alert("Registration successful!");
      console.log(data); // Handle the response as needed

      // Redirect to the homepage after successful registration
      router.push("/"); // Use router.push() for navigation
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        className="bg-white shadow-lg p-8 rounded-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {/* Name Field */}
        <div className="mb-4">
          <label htmlFor="name" className="block font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={`w-full p-2 border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={`w-full p-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className={`w-full p-2 border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="mb-6">
          <label
            htmlFor="confirmPassword"
            className="block font-medium mb-2"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className={`w-full p-2 border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } rounded-md`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
