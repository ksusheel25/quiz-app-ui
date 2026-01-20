import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, type RegisterUserRequest } from "../api/auth.api";
import Toast from "../conponents/Toast";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function Register() {
  const navigate = useNavigate();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toastCounter, setToastCounter] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterUserRequest>({
    defaultValues: {
      role: "STUDENT",
    },
  });

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = `${Date.now()}-${toastCounter}`;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const onSubmit = async (data: RegisterUserRequest) => {
    try {
      setIsLoading(true);
      await registerUser(data);
      addToast(`Account created successfully! Redirecting to login...`, "success");
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Registration failed. Please try again.";
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
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-6">Join Quizify today</p>

        {/* NAME */}
        <div className="mb-4">
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Full Name"
            className="input"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
        </div>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Email Address"
            className="input"
            type="email"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* PASSWORD */}
        <div className="mb-4">
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Min 6 characters" },
            })}
            placeholder="Password"
            className="input"
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {/* ROLE */}
        <div className="mb-6">
          <select
            {...register("role")}
            className="input"
          >
            <option value="STUDENT">Student</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button className="btn-primary w-full py-3" disabled={isLoading}>
          {isLoading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already registered?{" "}
          <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
