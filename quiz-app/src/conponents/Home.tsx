import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between">
        <h1 className="text-2xl font-bold">Quizify</h1>

        <div className="space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-white text-indigo-600 font-semibold"
          >
            Register
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12 mt-20">
        {/* LEFT */}
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold leading-tight">
            Test Your Knowledge <br /> With Smart Quizzes
          </h2>

          <p className="mt-6 text-lg text-indigo-100">
            Attempt quizzes, track your score, and improve your skills.
            Built for students & admins.
          </p>

          <div className="mt-10 flex gap-4">
            <Link
              to="/register"
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="border border-white px-6 py-3 rounded-xl hover:bg-white/10"
            >
              Login
            </Link>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 hidden md:block">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-10 shadow-xl">
            <ul className="space-y-4 text-lg">
              <li>✅ Timed Quizzes</li>
              <li>✅ Instant Score</li>
              <li>✅ Multiple Attempts Tracking</li>
              <li>✅ Admin Quiz Management</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
