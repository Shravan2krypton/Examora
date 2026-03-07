import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';

export default function MyResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultAPI.getByStudent().then(({ data }) => setResults(data)).finally(() => setLoading(false));
  }, []);

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
      <h1 className="text-2xl font-bold mb-2">My Results</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Review your past exam performance and compare via leaderboards.
      </p>
      {results.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No results yet. Take an exam to see your scores.</p>
          <Link to="/student/exams" className="btn-primary mt-4 inline-block">Browse Exams</Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {results.map((r) => (
            <div key={r.id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold">{r.exam?.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{r.exam?.subject}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(r.submissionTime).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {r.score}/{r.totalQuestions}
                </span>
                <Link to={`/student/results/${r.examId}`} className="btn-secondary text-sm">
                  View Details
                </Link>
                <Link to={`/leaderboard/${r.examId}`} className="btn-primary text-sm">
                  Leaderboard
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
