import { useEffect, useState } from "react";
import type { Quiz } from "../api/quiz.api";
import { getAllQuizzes, createQuiz, addQuestionToQuiz } from "../api/quiz.api";
import type { User } from "../api/users.api";
import { getAllUsers, updateUserRole } from "../api/users.api";
import type { AttemptResult } from "../api/attempts.api";
import { getQuizAttempts } from "../api/attempts.api";
import { getUserEmail } from "../api/auth.api";
import Toast from "../conponents/Toast";

interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"quizzes" | "users" | "attempts">("quizzes");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [attempts, setAttempts] = useState<AttemptResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [toastCounter, setToastCounter] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const adminEmail = getUserEmail();

  // Form states
  const [quizForm, setQuizForm] = useState({ title: "", description: "", status: "PUBLISHED" });
  const [questionForm, setQuestionForm] = useState({
    text: "",
    marks: 1,
    type: "MCQ" as "MCQ" | "TRUE_FALSE",
    options: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  useEffect(() => {
    loadData();
  }, []);

  const addToast = (message: string, type: "success" | "error" | "info" = "info") => {
    const id = `${Date.now()}-${toastCounter}`;
    setToastCounter(prev => prev + 1);
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [quizzesData, usersData] = await Promise.all([
        getAllQuizzes(),
        getAllUsers(),
      ]);
      setQuizzes(Array.isArray(quizzesData) ? quizzesData : []);
      setUsers(Array.isArray(usersData) ? usersData : []);
      addToast("Data loaded successfully", "success");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load data";
      addToast(errorMsg, "error");
      setQuizzes([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.title || !quizForm.description) {
      addToast("Please fill in all fields", "error");
      return;
    }

    try {
      const newQuiz = await createQuiz(adminEmail, {
        title: quizForm.title,
        description: quizForm.description,
        status: quizForm.status as "DRAFT" | "PUBLISHED",
      });
      
      // Reload all quizzes to ensure we have the latest data
      const updatedQuizzes = await getAllQuizzes();
      setQuizzes(Array.isArray(updatedQuizzes) ? updatedQuizzes : []);
      
      setQuizForm({ title: "", description: "", status: "PUBLISHED" });
      setShowCreateQuiz(false);
      addToast(`Quiz "${newQuiz.title}" created successfully!`, "success");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to create quiz";
      addToast(errorMsg, "error");
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuiz) return;

    if (!questionForm.text || questionForm.options.some(o => !o.text)) {
      addToast("Please fill in all fields", "error");
      return;
    }

    if (!questionForm.options.some(o => o.isCorrect)) {
      addToast("Please mark at least one option as correct", "error");
      return;
    }

    try {
      const newQuestion = await addQuestionToQuiz(selectedQuiz.id, {
        text: questionForm.text,
        marks: questionForm.marks,
        type: questionForm.type,
        options: questionForm.options,
      });

      // Update the quiz with new question
      setSelectedQuiz({
        ...selectedQuiz,
        questions: [...selectedQuiz.questions, newQuestion],
      });

      setQuestionForm({
        text: "",
        marks: 1,
        type: "MCQ",
        options: [
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
          { text: "", isCorrect: false },
        ],
      });
      setShowAddQuestion(false);
      addToast("Question added successfully!", "success");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to add question";
      addToast(errorMsg, "error");
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: "STUDENT" | "ADMIN", userName: string) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      addToast(`${userName}'s role updated to ${newRole}!`, "success");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to update user role";
      addToast(errorMsg, "error");
    }
  };

  const loadQuizAttempts = async (quizId: number) => {
    try {
      const attemptsData = await getQuizAttempts(quizId);
      setAttempts(attemptsData);
      addToast(`Loaded ${attemptsData.length} attempts`, "success");
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to load attempts";
      addToast(errorMsg, "error");
    }
  };

  const handleQuestionTypeChange = (newType: "MCQ" | "TRUE_FALSE") => {
    setQuestionForm(prev => ({
      ...prev,
      type: newType,
      options: newType === "TRUE_FALSE"
        ? [
            { text: "True", isCorrect: false },
            { text: "False", isCorrect: false },
          ]
        : [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
    }));
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 pt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center text-lg text-white">Loading...</div>
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
        <h1 className="text-4xl font-bold mb-2 text-white">👨‍💼 Admin Dashboard</h1>
        <p className="text-indigo-100 mb-8">Manage quizzes, users, and track attempts</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-white/20">
          <button
            onClick={() => setActiveTab("quizzes")}
            className={`px-6 py-3 font-bold transition-all text-sm ${
              activeTab === "quizzes"
                ? "bg-white/20 text-white border-b-2 border-green-400"
                : "text-indigo-200 hover:text-white hover:bg-white/10"
            }`}
          >
            📚 Quizzes
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-6 py-3 font-bold transition-all text-sm ${
              activeTab === "users"
                ? "bg-white/20 text-white border-b-2 border-blue-400"
                : "text-indigo-200 hover:text-white hover:bg-white/10"
            }`}
          >
            👥 Users
          </button>
          <button
            onClick={() => setActiveTab("attempts")}
            className={`px-6 py-3 font-bold transition-all text-sm ${
              activeTab === "attempts"
                ? "bg-white/20 text-white border-b-2 border-purple-400"
                : "text-indigo-200 hover:text-white hover:bg-white/10"
            }`}
          >
            📊 Attempts
          </button>
        </div>

        {/* QUIZZES TAB */}
        {activeTab === "quizzes" && (
          <div>
            <button
              onClick={() => setShowCreateQuiz(!showCreateQuiz)}
              className="mb-6 px-6 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg font-bold hover:shadow-lg hover:shadow-green-500/50 transition transform hover:scale-105"
            >
              {showCreateQuiz ? "✕ Cancel" : "+ Create Quiz"}
            </button>

            {showCreateQuiz && (
              <form onSubmit={handleCreateQuiz} className="mb-6 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-xl border border-white/20">
                <div className="mb-4">
                  <label className="block text-sm font-bold text-white mb-2">Quiz Title</label>
                  <input
                    type="text"
                    value={quizForm.title}
                    onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:border-white placeholder-indigo-200"
                    placeholder="Enter quiz title"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-bold text-white mb-2">Description</label>
                  <textarea
                    value={quizForm.description}
                    onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 text-white rounded-lg focus:outline-none focus:border-white placeholder-indigo-200"
                    rows={3}
                    placeholder="Enter quiz description"
                  />
                </div>
                <button type="submit" className="w-full bg-gradient-to-r from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white font-bold py-3 rounded-lg transition transform hover:scale-105">
                  Create Quiz
                </button>
              </form>
            )}

            {quizzes.length === 0 ? (
              <div className="text-center text-indigo-100 py-12 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                No quizzes created yet. Start by creating your first quiz!
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {Array.isArray(quizzes) && quizzes.map((quiz) => (
                  <div key={quiz.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 hover:border-white/40 p-6 hover:shadow-2xl hover:bg-white/20 transition-all transform hover:scale-105">
                    <h3 className="text-lg font-bold text-white mb-2">{quiz.title}</h3>
                    <p className="text-sm text-indigo-100 mb-4">{quiz.description}</p>
                    <div className="mb-4 p-3 bg-white/10 rounded-lg border border-white/20">
                      <p className="text-sm text-white font-semibold">❓ {quiz.questions.length} Questions</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          setShowAddQuestion(true);
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:shadow-lg hover:shadow-green-500/50 text-sm font-bold transition-all transform hover:scale-105"
                      >
                        ➕ Add Question
                      </button>
                      <button
                        onClick={() => {
                          setSelectedQuiz(quiz);
                          loadQuizAttempts(quiz.id);
                          setActiveTab("attempts");
                        }}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-lg hover:shadow-lg hover:shadow-blue-500/50 text-sm font-bold transition-all transform hover:scale-105"
                      >
                        View Attempts
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedQuiz && showAddQuestion && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <form
                  onSubmit={handleAddQuestion}
                  className="bg-white rounded-lg shadow p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                >
                  <h2 className="text-2xl font-bold mb-4">Add Question to {selectedQuiz.title}</h2>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Question Text</label>
                    <textarea
                      value={questionForm.text}
                      onChange={(e) => setQuestionForm({ ...questionForm, text: e.target.value })}
                      required
                      className="input"
                      rows={3}
                      placeholder="Enter question"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">Marks</label>
                      <input
                        type="number"
                        value={questionForm.marks}
                        onChange={(e) => setQuestionForm({ ...questionForm, marks: parseInt(e.target.value) })}
                        min="1"
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">Type</label>
                      <select
                        value={questionForm.type}
                        onChange={(e) => handleQuestionTypeChange(e.target.value as "MCQ" | "TRUE_FALSE")}
                        className="input"
                      >
                        <option value="MCQ">MCQ</option>
                        <option value="TRUE_FALSE">True/False</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-semibold mb-2">Options</label>
                    {questionForm.options.map((opt, idx) => (
                      <div key={idx} className="mb-2 flex gap-2">
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOpts = [...questionForm.options];
                            newOpts[idx].text = e.target.value;
                            setQuestionForm({ ...questionForm, options: newOpts });
                          }}
                          placeholder={`Option ${idx + 1}`}
                          required
                          className="input flex-1"
                        />
                        <label className="flex items-center gap-2 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={opt.isCorrect}
                            onChange={(e) => {
                              const newOpts = [...questionForm.options];
                              newOpts[idx].isCorrect = e.target.checked;
                              setQuestionForm({ ...questionForm, options: newOpts });
                            }}
                          />
                          Correct
                        </label>
                        {questionForm.type === "MCQ" && questionForm.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const newOpts = questionForm.options.filter((_, i) => i !== idx);
                              setQuestionForm({ ...questionForm, options: newOpts });
                            }}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm whitespace-nowrap"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    {questionForm.type === "MCQ" && questionForm.options.length < 6 && (
                      <button
                        type="button"
                        onClick={() => {
                          setQuestionForm({
                            ...questionForm,
                            options: [...questionForm.options, { text: "", isCorrect: false }],
                          });
                        }}
                        className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm font-semibold"
                      >
                        + Add Option
                      </button>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 btn-primary px-4 py-2">
                      Add Question
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddQuestion(false)}
                      className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === "users" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow overflow-hidden border border-white/20">
            {users.length === 0 ? (
              <div className="p-6 text-center text-indigo-100">No users found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/20 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/10 hover:bg-white/10 transition">
                      <td className="px-6 py-3 text-white font-semibold">{user.name}</td>
                      <td className="px-6 py-3 text-indigo-100">{user.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.role === "ADMIN"
                            ? "bg-purple-500/50 text-purple-200 border border-purple-400/50"
                            : "bg-blue-500/50 text-blue-200 border border-blue-400/50"
                        }`}>
                          {user.role === "ADMIN" ? "👨‍💼 " : "👤 "}{user.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 flex gap-2">
                        {user.role === "STUDENT" ? (
                          <button
                            onClick={() => handleUpdateUserRole(user.id, "ADMIN", user.name)}
                            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs rounded-lg font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                          >
                            👨‍💼 Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleUpdateUserRole(user.id, "STUDENT", user.name)}
                            className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-105"
                          >
                            👤 Make Student
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ATTEMPTS TAB */}
        {activeTab === "attempts" && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl shadow overflow-hidden border border-white/20">
            {attempts.length === 0 ? (
              <div className="p-6 text-center text-indigo-100">
                {selectedQuiz ? "No attempts for this quiz yet" : "Select a quiz to view attempts"}
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white/20 border-b border-white/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Student Email</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Quiz ID</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Score</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-white">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b border-white/10 hover:bg-white/10 transition">
                      <td className="px-6 py-3 text-white font-semibold">{attempt.studentEmail}</td>
                      <td className="px-6 py-3 text-indigo-200">{attempt.quizId}</td>
                      <td className="px-6 py-3 font-bold text-green-300">{attempt.score}/{attempt.totalMarks}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          attempt.status === "COMPLETED"
                            ? "bg-green-500/50 text-green-200 border border-green-400/50"
                            : "bg-yellow-500/50 text-yellow-200 border border-yellow-400/50"
                        }`}>
                          {attempt.status === "COMPLETED" ? "✓ " : "⏳ "}{attempt.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
