import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../conponents/Layout";

export default function QuizPage() {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});

  useEffect(() => {
    axiosClient.get(`/api/quizzes/${quizId}`).then(res => setQuiz(res.data));
  }, [quizId]);

  const selectOption = (qId: number, oId: number) => {
    setAnswers(prev => ({ ...prev, [qId]: oId }));
  };

  if (!quiz) return <div className="text-center mt-10">Loading...</div>;

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow p-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {quiz.title}
        </h1>

        <div className="mt-8 space-y-8">
          {quiz.questions.map((q: any, index: number) => (
            <div key={q.id}>
              <p className="font-semibold text-gray-700 mb-3">
                {index + 1}. {q.text}
              </p>

              <div className="space-y-2">
                {q.options.map((o: any) => (
                  <label
                    key={o.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                      ${answers[q.id] === o.id
                        ? "border-indigo-600 bg-indigo-50"
                        : "hover:bg-gray-50"}`}
                  >
                    <input
                      type="radio"
                      checked={answers[q.id] === o.id}
                      onChange={() => selectOption(q.id, o.id)}
                    />
                    <span>{o.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button className="mt-10 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700">
          Submit Quiz
        </button>
      </div>
    </Layout>
  );
}
