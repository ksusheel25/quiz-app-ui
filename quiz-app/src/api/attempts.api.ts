import axiosClient from "./axiosClient";

export interface Answer {
  questionId: number;
  optionId: number;
}

export interface SubmitQuizRequest {
  answers: Answer[];
}

export interface AttemptResult {
  id: number;
  quizId: number;
  studentEmail: string;
  score: number;
  totalMarks: number;
  status: "IN_PROGRESS" | "COMPLETED";
  submittedAt?: string;
}

// Start quiz attempt
export const startQuizAttempt = async (
  studentEmail: string,
  quizId: number
): Promise<AttemptResult> => {
  const { data } = await axiosClient.post<AttemptResult>(
    `/api/attempts/start?studentEmail=${studentEmail}&quizId=${quizId}`
  );
  return data;
};

// Submit quiz
export const submitQuiz = async (
  studentEmail: string,
  quizId: number,
  answers: Answer[]
): Promise<AttemptResult> => {
  const { data } = await axiosClient.post<AttemptResult>(
    `/api/attempts/quiz/${quizId}/submit?studentEmail=${studentEmail}`,
    { answers }
  );
  return data;
};

// Get my attempts
export const getMyAttempts = async (
  studentEmail: string
): Promise<AttemptResult[]> => {
  const { data } = await axiosClient.get<AttemptResult[]>(
    `/api/attempts/me?studentEmail=${studentEmail}`
  );
  return data;
};

// Get attempts for a quiz (Admin)
export const getQuizAttempts = async (quizId: number): Promise<AttemptResult[]> => {
  const { data } = await axiosClient.get<AttemptResult[]>(
    `/api/attempts/quiz/${quizId}`
  );
  return data;
};

// Get all attempts (Admin)
export const getAllAttempts = async (): Promise<AttemptResult[]> => {
  const { data } = await axiosClient.get<AttemptResult[]>("/api/attempts/all");
  return data;
};
