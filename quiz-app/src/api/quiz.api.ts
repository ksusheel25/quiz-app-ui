import axiosClient from "./axiosClient";

export interface Option {
  id?: number;
  text: string;
  isCorrect?: boolean;
}

export interface Question {
  id: number;
  text: string;
  marks: number;
  type: "MCQ" | "TRUE_FALSE";
  options: Option[];
}

export interface Quiz {
  id: number;
  title: string;
  description: string;
  totalMarks: number;
  timeLimit: number;
  status: "DRAFT" | "PUBLISHED";
  questions: Question[];
  createdBy?: string;
}

export interface CreateQuizRequest {
  title: string;
  description: string;
  status: "DRAFT" | "PUBLISHED";
}

export interface AddQuestionRequest {
  text: string;
  marks: number;
  type: "MCQ" | "TRUE_FALSE";
  options: Option[];
}

// Get all quizzes
export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const { data } = await axiosClient.get<Quiz[]>("/api/quizzes");
  return data;
};

// Get quiz by ID
export const getQuizById = async (quizId: number): Promise<Quiz> => {
  const { data } = await axiosClient.get<Quiz>(`/api/quizzes/${quizId}`);
  return data;
};

// Create quiz (Admin)
export const createQuiz = async (
  adminEmail: string,
  quiz: CreateQuizRequest
): Promise<Quiz> => {
  const { data } = await axiosClient.post<Quiz>(
    `/api/quizzes?adminEmail=${adminEmail}`,
    quiz
  );
  return data;
};

// Add question to quiz (Admin)
export const addQuestionToQuiz = async (
  quizId: number,
  question: AddQuestionRequest
): Promise<Question> => {
  const { data } = await axiosClient.post<Question>(
    `/api/quizzes/${quizId}/questions`,
    question
  );
  return data;
};
