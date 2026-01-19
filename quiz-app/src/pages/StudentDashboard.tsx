import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../conponents/Layout";

interface Quiz {
  id: number;
  title: string;
  description: string;
  totalMarks: number;
  timeLimit: number;
}

export default function StudentDashboard() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient.get("/api/quizzes").then(res => setQuizzes(res.data));
  }, []);

  return (
    <Layout>
      <h2 className="text-3xl font-bold mb-8 text-gray-800">
        Available Quizzes
      </h2>

      {quizzes.length === 0 ? (
        <div className="text-center text-gray-500">
          No quizzes available right now
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-xl shadow hover:shadow-lg transition-all border"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">
                  {quiz.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {quiz.description}
                </p>

                <div className="flex justify-between text-sm mt-6 text-gray-600">
                  <span>📝 {quiz.totalMarks} Marks</span>
                  <span>⏱ {quiz.timeLimit} min</span>
                </div>

                <button
                  onClick={() => navigate(`/student/quiz/${quiz.id}`)}
                  className="mt-6 w-full bg-indigo-600 text-white py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
                >
                  Start Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}
