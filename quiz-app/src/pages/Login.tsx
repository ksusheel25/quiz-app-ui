import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, type LoginRequest } from "../api/auth.api";
import Toast from "../conponents/Toast";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function Login() {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastCounter, setToastCounter] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = `${Date.now()}-${toastCounter}`;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const onSubmit = async (data: LoginRequest) => {
    try {
      setIsLoading(true);
      const res = await loginUser(data);
      localStorage.setItem("token", res.token);
      localStorage.setItem("userEmail", res.email);
      localStorage.setItem("userRole", res.role);

      addToast(`Login successful! Welcome ${res.email}`, "success");
      
      setTimeout(() => {
        if (res.role === "ADMIN") navigate("/admin");
        else navigate("/student");
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Login failed. Please try again.";
      addToast(errorMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl w-full max-w-md shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-600 mb-6">Welcome back to Quizify</p>

        <div className="mb-4">
          <input
            {...register("email", { required: "Email required" })}
            placeholder="Email Address"
            className="input"
            type="email"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <input
            type="password"
            {...register("password", { required: "Password required" })}
            placeholder="Password"
            className="input"
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        <button className="btn-primary mt-5 w-full py-3" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          New user?{" "}
          <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
}

