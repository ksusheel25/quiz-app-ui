import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import AuthLayout from "../conponents/AuthLayout";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    await axiosClient.post("/api/users/register", {
      name,
      email,
      password,
      role: "STUDENT",
    });

    navigate("/login");
  };

  return (
    <AuthLayout>
      <h2 className="text-3xl font-bold text-center text-gray-800">
        Create Account
      </h2>

      <div className="mt-8 space-y-4">
        <input
          placeholder="Full Name"
          className="w-full border px-4 py-3 rounded-lg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          placeholder="Email"
          className="w-full border px-4 py-3 rounded-lg"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-3 rounded-lg"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={register}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
        >
          Register
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?
        <Link to="/login" className="text-indigo-600 font-semibold ml-1">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}
