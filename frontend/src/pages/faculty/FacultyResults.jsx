import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultAPI, examAPI } from '../../services/api';

export default function FacultyResults() {
  const { examId } = useParams();
  const [results, setResults] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      resultAPI.getExamResults(examId),
      examAPI.getById(examId)
    ]).then(([resRes, examRes]) => {
      setResults(resRes.data);
      setExam(examRes.data);
    }).finally(() => setLoading(false));
  }, [examId]);

  const [sortBy, setSortBy] = useState('rank');
  const [sortDir, setSortDir] = useState('asc');

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === 'name') {
      return sortDir === 'asc'
        ? (a.student?.name || '').localeCompare(b.student?.name || '')
        : (b.student?.name || '').localeCompare(a.student?.name || '');
    }
    if (sortBy === 'score') {
      return sortDir === 'asc' ? a.score - b.score : b.score - a.score;
    }
    if (sortBy === 'submitted') {
      const at = new Date(a.submissionTime).getTime();
      const bt = new Date(b.submissionTime).getTime();
      return sortDir === 'asc' ? at - bt : bt - at;
    }
    return 0;
  });

  const toggleSort = (key) => {
    setSortBy((prevKey) => (prevKey === key ? prevKey : key));
    setSortDir((prevDir) =>
      sortBy === key ? (prevDir === 'asc' ? 'desc' : 'asc') : 'asc'
    );
  };

  const sortIcon = (key) => {
    if (sortBy !== key) return '↕';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Results - {exam?.title}</h1>
        <div className="flex gap-2">
          <Link to="/faculty" className="btn-secondary">Back to Dashboard</Link>
          <Link to={`/leaderboard/${examId}`} className="btn-primary">View Leaderboard</Link>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-3">Rank</th>
                <th
                  className="text-left px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSort('name')}
                >
                  Student{' '}
                  <span className="text-xs text-gray-500">{sortIcon('name')}</span>
                </th>
                <th className="text-left px-4 py-3">Email</th>
                <th
                  className="text-left px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSort('score')}
                >
                  Score{' '}
                  <span className="text-xs text-gray-500">{sortIcon('score')}</span>
                </th>
                <th
                  className="text-left px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSort('submitted')}
                >
                  Submitted{' '}
                  <span className="text-xs text-gray-500">{sortIcon('submitted')}</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sortedResults.map((r, i) => (
                <tr
                  key={r.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-900/60 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold">{i + 1}</td>
                  <td className="px-4 py-3">{r.student?.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{r.student?.email}</td>
                  <td className="px-4 py-3 font-medium">{r.score}/{r.totalQuestions}</td>
                  <td className="px-4 py-3 text-sm">{new Date(r.submissionTime).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
