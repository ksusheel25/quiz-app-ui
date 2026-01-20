import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Quiz } from "../api/quiz.api";
import { getQuizById } from "../api/quiz.api";
import type { Answer, AttemptResult } from "../api/attempts.api";
import { submitQuiz } from "../api/attempts.api";
import { getUserEmail } from "../api/auth.api";
import Toast from "../conponents/Toast";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastCounter, setToastCounter] = useState(0);
  const studentEmail = getUserEmail();

  useEffect(() => {
    if (quizId) {
      loadQuiz();
    }
  }, [quizId]);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = `${Date.now()}-${toastCounter}`;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await getQuizById(parseInt(quizId!));
      setQuiz(quizData);
      addToast(`Quiz loaded: ${quizData.title}`, "success");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load quiz";
      addToast(errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const selectOption = (questionId: number, optionId: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Check if all questions are answered
    const unanswered = quiz.questions.filter((q) => !(q.id in answers));
    if (unanswered.length > 0) {
      addToast(`Please answer all questions. ${unanswered.length} remaining.`, "error");
      return;
    }

    try {
      setSubmitting(true);
      const answerArray: Answer[] = Object.entries(answers).map(([qId, optId]) => ({
        questionId: parseInt(qId),
        optionId: optId,
      }));

      const result: AttemptResult = await submitQuiz(
        studentEmail,
        quiz.id,
        answerArray
      );

      // Show success message
      addToast(`Quiz submitted successfully! Score: ${result.score}/${result.totalMarks}`, "success");
      
      // Redirect after showing message
      setTimeout(() => {
        navigate("/student");
      }, 2000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to submit quiz";
      addToast(errorMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center text-lg text-gray-600">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-red-600 mb-4">Quiz not found</div>
          <button
            onClick={() => navigate("/student")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-600">{quiz.description}</p>
            <div className="flex gap-6 mt-4 text-sm text-gray-600">
              <span>📝 Total Marks: {quiz.totalMarks}</span>
              <span>⏱ Time Limit: {quiz.timeLimit} minutes</span>
              <span>❓ Questions: {quiz.questions.length}</span>
            </div>
          </div>

          <div className="space-y-8">
            {quiz.questions.map((question, index) => (
              <div
                key={question.id}
                className="border-b pb-8 last:border-b-0"
              >
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Question {index + 1}: ({question.marks} marks)
                  </h3>
                  <p className="text-gray-700 mt-2">{question.text}</p>
                </div>

                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label
                      key={option.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        answers[question.id] === option.id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        checked={answers[question.id] === option.id}
                        onChange={() => selectOption(question.id, option.id!)}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-700">{option.text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => navigate("/student")}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {submitting ? "Submitting..." : "Submit Quiz"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

