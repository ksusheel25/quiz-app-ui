import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Quiz } from "../api/quiz.api";
import { getAllQuizzes } from "../api/quiz.api";
import type { AttemptResult } from "../api/attempts.api";
import { startQuizAttempt, getMyAttempts } from "../api/attempts.api";
import { getUserEmail } from "../api/auth.api";
import Toast from "../conponents/Toast";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastCounter, setToastCounter] = useState(0);
  const navigate = useNavigate();
  const studentEmail = getUserEmail();

  useEffect(() => {
    fetchData();
  }, []);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = `${Date.now()}-${toastCounter}`;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [quizzesData, attemptsData] = await Promise.all([
        getAllQuizzes(),
        getMyAttempts(studentEmail),
      ]);
      setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
      setAttempts(Array.isArray(attemptsData) ? attemptsData : []);
      if (Array.isArray(quizzesData) && quizzesData.length > 0) {
        addToast(`Loaded ${quizzesData.length} quizzes`, "success");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load quizzes";
      addToast(errorMsg, "error");
      setQuizzes([]);
      setAttempts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async (quizId: number, quizTitle: string) => {
    try {
      await startQuizAttempt(studentEmail, quizId);
      addToast(`Starting quiz: ${quizTitle}`, "success");
      setTimeout(() => navigate(`/quiz/${quizId}`), 500);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to start quiz";
      addToast(errorMsg, "error");
    }
  };

  const isQuizAttempted = (quizId: number) => {
    return attempts.some(att => att.quizId === quizId);
  };

  const getAttemptResult = (quizId: number) => {
    return attempts.find(att => att.quizId === quizId);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-lg text-white">Loading quizzes...</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 pt-20">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2 text-white">
            📚 Available Quizzes
          </h2>
          <p className="text-indigo-100">Welcome back, <span className="font-semibold">{studentEmail}</span></p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center text-indigo-100 py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <p className="text-lg">No quizzes available right now</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.isArray(quizzes) && quizzes.map((quiz) => {
              const attempt = getAttemptResult(quiz.id);
              const isAttempted = isQuizAttempted(quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 transition-all hover:shadow-2xl hover:bg-white/20 transform hover:scale-105"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-white flex-1">
                        {quiz.title}
                      </h3>
                      {isAttempted && (
                        <span className="bg-green-400 text-green-900 text-xs px-3 py-1 rounded-full font-semibold">
                          ✓ Attempted
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-indigo-100 mb-4">
                      {quiz.description}
                    </p>

                    <div className="flex justify-between text-sm text-indigo-200 mb-6 pb-6 border-b border-white/20">
                      <span>📝 {quiz.totalMarks} Marks</span>
                      <span>⏱ {quiz.timeLimit} min</span>
                    </div>

                    {isAttempted && attempt && (
                      <div className="mb-4 p-3 bg-white/10 rounded-lg border border-green-400/50">
                        <p className="text-sm font-semibold text-white">
                          Score: <span className="text-green-300">{attempt.score}/{attempt.totalMarks}</span>
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => handleStartQuiz(quiz.id, quiz.title)}
                      disabled={isAttempted}
                      className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${
                        isAttempted
                          ? "bg-gray-400/50 text-gray-200 cursor-not-allowed"
                          : "bg-gradient-to-r from-green-400 to-green-500 text-white hover:shadow-lg hover:shadow-green-500/50"
                      }`}
                    >
                      {isAttempted ? "Already Attempted" : "Start Quiz"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
