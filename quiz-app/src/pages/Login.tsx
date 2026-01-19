import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthLayout from "../conponents/AuthLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    const res = await axiosClient.post("/api/auth/login", {
      email,
      password,
    });

    localStorage.setItem("token", res.data.token);
    navigate("/student/dashboard");
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Welcome Back
      </h2>
      <p className="text-center text-gray-500 mt-2">
        Login to continue
      </p>

      <div className="mt-8 space-y-4">
        <input
          placeholder="Email"
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Login
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don’t have an account?
        <Link to="/register" className="text-indigo-600 font-semibold ml-1">
          Register
        </Link>
      </p>
    </AuthLayout>
  );
}
