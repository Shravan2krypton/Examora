import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import { resultAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Leaderboard() {
  const { examId } = useParams();
  const [leaderboard, setLeaderboard] = useState([]);
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    resultAPI.getLeaderboard(examId).then(({ data }) => {
      setLeaderboard(data.leaderboard || data);
      setExam(data.exam || null);
    }).finally(() => setLoading(false));
  }, [examId]);

  useEffect(() => {
    const socket = io(window.location.origin, { path: '/socket.io' });
    socket.emit('join-exam', examId);
    socket.on('leaderboard-update', (data) => setLeaderboard(data));
    return () => {
      socket.emit('leave-exam', examId);
      socket.disconnect();
    };
  }, [examId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">
          Leaderboard {exam && `- ${exam.title}`}
        </h1>
        <Link to="/" className="btn-secondary text-sm">Back to Home</Link>
      </div>

      {leaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No submissions yet.</p>
        </div>
      ) : (
        <div className="card overflow-hidden p-0">
          <table className="w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="text-left px-4 py-3">Rank</th>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Score</th>
                <th className="text-left px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {leaderboard.map((entry) => {
                const isCurrentUser = user && entry.studentId === user.id;
                return (
                <tr
                  key={entry.studentId}
                  className={`transition-colors ${
                    isCurrentUser
                      ? 'bg-primary-50 dark:bg-primary-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-900/60'
                  }`}
                >
                  <td className="px-4 py-3 font-semibold">
                    {entry.rank === 1 && '🥇'}
                    {entry.rank === 2 && '🥈'}
                    {entry.rank === 3 && '🥉'}
                    {entry.rank > 3 && entry.rank}
                  </td>
                  <td className="px-4 py-3">
                    {entry.studentName}
                    {isCurrentUser && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-700 dark:text-primary-200">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {entry.score}/{entry.totalQuestions}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                    {new Date(entry.submissionTime).toLocaleString()}
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
