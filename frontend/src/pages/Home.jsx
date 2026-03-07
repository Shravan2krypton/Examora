import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  
  console.log('Home component is rendering, user:', user);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
            Online Examination System
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Enhanced with modern animations and UI!
          </p>
          
          {user ? (
            <div className="space-y-4">
              <p className="text-green-600 font-semibold">✅ Logged in as: {user.name} ({user.role})</p>
              {user.role === 'student' && (
                <Link to="/student/exams" className="btn-primary">
                  Go to Student Dashboard
                </Link>
              )}
              {user.role === 'faculty' && (
                <Link to="/faculty" className="btn-primary">
                  Go to Faculty Dashboard
                </Link>
              )}
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/register" className="btn-primary">
                Register as Student
              </Link>
              <Link to="/login" className="btn-secondary">
                Faculty Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}