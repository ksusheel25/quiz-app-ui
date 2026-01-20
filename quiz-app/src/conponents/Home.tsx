import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllQuizzes } from "../api/quiz.api";
import type { Quiz } from "../api/quiz.api";
import { isLoggedIn } from "../api/auth.api";

export default function Home() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getAllQuizzes();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load quizzes:", err);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, Math.ceil(quizzes.length / 3)));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, Math.ceil(quizzes.length / 3))) % Math.max(1, Math.ceil(quizzes.length / 3)));
  };

  const itemsPerSlide = 3;
  const startIdx = currentSlide * itemsPerSlide;
  const visibleQuizzes = Array.isArray(quizzes) ? quizzes.slice(startIdx, startIdx + itemsPerSlide) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-32 flex flex-col md:flex-row items-center gap-12">
        {/* LEFT */}
        <div className="flex-1">
          <h2 className="text-5xl font-extrabold leading-tight">
            Test Your Knowledge <br /> With Smart Quizzes
          </h2>

          <p className="mt-6 text-lg text-indigo-100">
            Attempt quizzes, track your score, and improve your skills.
            Built for students & admins.
          </p>

          <div className="mt-8 flex gap-4">
            {!isLoggedIn() ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition shadow-lg"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/register")}
                  className="px-8 py-3 border-2 border-white text-white rounded-lg font-bold hover:bg-white hover:text-indigo-600 transition"
                >
                  Register
                </button>
              </>
            ) : (
              <button
                onClick={() => navigate("/student")}
                className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition shadow-lg"
              >
                Start Taking Quizzes
              </button>
            )}
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

      {/* Featured Quizzes Carousel */}
      {!loading && quizzes.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="mb-8">
            <h3 className="text-3xl font-bold mb-2">📚 Featured Quizzes</h3>
            <p className="text-indigo-100">Explore our collection of quizzes and test your knowledge</p>
          </div>

          <div className="relative">
            {/* Carousel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {visibleQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl p-6 hover:bg-white/20 transition transform hover:scale-105 cursor-pointer border border-white/20 shadow-lg"
                  onClick={() => isLoggedIn() ? navigate(`/quiz/${quiz.id}`) : navigate("/login")}
                >
                  <div className="mb-4">
                    <div className="inline-block bg-indigo-400 text-white px-3 py-1 rounded-full text-xs font-semibold mb-2">
                      {quiz.questions.length} Questions
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold mb-2 line-clamp-2">{quiz.title}</h4>
                  <p className="text-indigo-100 text-sm line-clamp-2 mb-4">{quiz.description}</p>
                  
                  <div className="flex justify-between items-center text-sm text-indigo-200 mb-4">
                    <span>⭐ {quiz.totalMarks} Marks</span>
                    <span>⏱ {quiz.timeLimit} min</span>
                  </div>

                  <button className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-2 rounded-lg transition">
                    {isLoggedIn() ? "Start Quiz" : "Login to Take"}
                  </button>
                </div>
              ))}
            </div>

            {/* Carousel Controls */}
            {quizzes.length > itemsPerSlide && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={prevSlide}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                >
                  ← Prev
                </button>
                
                <div className="flex gap-2">
                  {Array.from({ length: Math.ceil(quizzes.length / itemsPerSlide) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-2 h-2 rounded-full transition ${
                        idx === currentSlide ? "bg-white w-8" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>

                <button
                  onClick={nextSlide}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="bg-black/30 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <h4 className="text-4xl font-bold">500+</h4>
              <p className="text-indigo-100 mt-2">Questions</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold">100+</h4>
              <p className="text-indigo-100 mt-2">Quizzes</p>
            </div>
            <div>
              <h4 className="text-4xl font-bold">1000+</h4>
              <p className="text-indigo-100 mt-2">Active Users</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
