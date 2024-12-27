"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link"; // Import Link for navigation

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      // Make a POST request to your Express login endpoint
      const response = await fetch("https://task-management-api-52oc.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to log in. Please check your credentials.");
      }

      const data = await response.json();

      console.log("Login successful:", data);

      // Store the token in localStorage or cookies (example: localStorage)
      localStorage.setItem("token", data.token);

      // Redirect to the dashboard or another authenticated page
      router.push("/");
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Log In</h2>
        {error && <p className="text-red-500">{error}</p>}
        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Log In
        </button>
      </form>

      {/* Link to the registration page */}
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <Link href="/register" className="text-blue-500 hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  );
}
