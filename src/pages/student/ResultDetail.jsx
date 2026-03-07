import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { resultAPI } from '../../services/api';

export default function ResultDetail() {
  const { examId } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resultAPI.getDetail(examId).then(({ data }) => setResult(data)).finally(() => setLoading(false));
  }, [examId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!result) return null;

  const correct = result.questionDetails?.filter((q) => q.isCorrect).length || 0;
  const wrong = (result.questionDetails?.length || 0) - correct;
  const total = result.questionDetails?.length || 0;
  const correctPct = total ? (correct / total) * 100 : 0;
  const wrongPct = total ? (wrong / total) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="card mb-8">
        <h1 className="text-2xl font-bold mb-4">{result.exam?.title}</h1>
        <div className="flex flex-wrap gap-6 items-center">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Score: </span>
            <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {result.score}/{result.totalQuestions}
            </span>
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Correct: {correct}</span>
          </div>
          <div>
            <span className="text-red-600 dark:text-red-400">Wrong: {wrong}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Submitted: </span>
            {new Date(result.submissionTime).toLocaleString()}
          </div>
        </div>

        {total > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>Performance</span>
              <span>{correct} correct / {total} questions</span>
            </div>
            <div className="h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden flex">
              <div
                className="h-full bg-green-500"
                style={{ width: `${correctPct}%` }}
              />
              <div
                className="h-full bg-red-500"
                style={{ width: `${wrongPct}%` }}
              />
            </div>
          </div>
        )}
        <Link to={`/leaderboard/${examId}`} className="btn-primary mt-4 inline-block">
          View Leaderboard
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4">Question Review</h2>
      <div className="space-y-4">
        {result.questionDetails?.map((q, i) => (
          <div
            key={q.id}
            className={`card border-l-4 ${
              q.isCorrect ? 'border-green-500' : 'border-red-500'
            }`}
          >
            <p className="font-medium mb-2">{i + 1}. {q.questionText}</p>
            <p className="text-sm">
              <span className="text-green-600 dark:text-green-400">Correct: </span>
              {q[`option${q.correctAnswer?.toUpperCase()}`]}
            </p>
            {!q.isCorrect && q.selectedAnswer && (
              <p className="text-sm">
                <span className="text-red-600 dark:text-red-400">Your answer: </span>
                {q[`option${q.selectedAnswer?.toUpperCase()}`]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
