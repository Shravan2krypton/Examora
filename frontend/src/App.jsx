import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

import StudentDashboard from './pages/student/StudentDashboard';
import AvailableExams from './pages/student/AvailableExams';
import AttemptExam from './pages/student/AttemptExam';
import MyResults from './pages/student/MyResults';
import ResultDetail from './pages/student/ResultDetail';
import QuestionBanks from './pages/student/QuestionBanks';
import Leaderboard from './pages/Leaderboard';

import FacultyDashboard from './pages/faculty/FacultyDashboard';
import CreateExam from './pages/faculty/CreateExam';
import AddQuestions from './pages/faculty/AddQuestions';
import UploadQuestionBank from './pages/faculty/UploadQuestionBank';
import FacultyResults from './pages/faculty/FacultyResults';

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}

export default function App() {
  console.log('App component is rendering');
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="leaderboard/:examId" element={<Leaderboard />} />

        <Route
          path="student"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exams"
          element={
            <ProtectedRoute role="student">
              <AvailableExams />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/exam/:examId"
          element={
            <ProtectedRoute role="student">
              <AttemptExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/results"
          element={
            <ProtectedRoute role="student">
              <MyResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/results/:examId"
          element={
            <ProtectedRoute role="student">
              <ResultDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="student/question-banks"
          element={
            <ProtectedRoute role="student">
              <QuestionBanks />
            </ProtectedRoute>
          }
        />

        <Route
          path="faculty"
          element={
            <ProtectedRoute role="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="faculty/create-exam"
          element={
            <ProtectedRoute role="faculty">
              <CreateExam />
            </ProtectedRoute>
          }
        />
        <Route
          path="faculty/exam/:examId/questions"
          element={
            <ProtectedRoute role="faculty">
              <AddQuestions />
            </ProtectedRoute>
          }
        />
        <Route
          path="faculty/upload-questionbank"
          element={
            <ProtectedRoute role="faculty">
              <UploadQuestionBank />
            </ProtectedRoute>
          }
        />
        <Route
          path="faculty/exam/:examId/results"
          element={
            <ProtectedRoute role="faculty">
              <FacultyResults />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
