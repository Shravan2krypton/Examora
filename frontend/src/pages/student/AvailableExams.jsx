import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { examAPI } from '../../services/api';

export default function AvailableExams() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    examAPI.getAll().then(({ data }) => setExams(data)).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const availableExams = exams.filter(
    (e) => !e.start_time || new Date(e.start_time) <= now
  );

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950">
      <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Available Exams</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Join any active exam within its scheduled time window.
          </p>
        </div>
      </div>
      {availableExams.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No exams available at the moment.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {availableExams.map((exam) => (
            <div key={exam.id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:-translate-y-0.5 hover:shadow-xl transition-all duration-150">
              <div>
                <h3 className="font-semibold text-lg">{exam.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{exam.description}</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Duration: {exam.duration} minutes
                </p>
              </div>
              <Link
                to={`/student/exam/${exam.id}`}
                className="btn-primary self-start sm:self-center"
              >
                Start Exam
              </Link>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
