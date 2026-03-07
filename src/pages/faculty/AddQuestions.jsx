import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { questionAPI, examAPI } from '../../services/api';

export default function AddQuestions() {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState({
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'a'
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([
      examAPI.getById(examId),
      questionAPI.getByExam(examId)
    ]).then(([examRes, qRes]) => {
      setExam(examRes.data);
      setQuestions(qRes.data);
    }).finally(() => setLoading(false));
  }, [examId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSubmitting(true);
    try {
      await questionAPI.add({ examId, ...form });
      setQuestions((prev) => [...prev, { ...form, id: 'new' }]);
      setForm({
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'a'
      });
      setMessage('Question added successfully.');
      questionAPI.getByExam(examId).then(({ data }) => setQuestions(data));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add question');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkAdd = async (e) => {
    e.preventDefault();
    const count = parseInt(prompt('How many questions to add?', '5'), 10);
    if (!count || count < 1) return;
    const qs = [];
    for (let i = 0; i < count; i++) {
      qs.push({
        questionText: `Sample Question ${questions.length + i + 1}?`,
        optionA: 'Option A',
        optionB: 'Option B',
        optionC: 'Option C',
        optionD: 'Option D',
        correctAnswer: ['a', 'b', 'c', 'd'][i % 4]
      });
    }
    setSubmitting(true);
    try {
      await questionAPI.addBulk({ examId, questions: qs });
      setMessage(`${count} sample questions added.`);
      questionAPI.getByExam(examId).then(({ data }) => setQuestions(data));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Bulk add failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  const remaining = (exam?.totalQuestions || 0) - questions.length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Add Questions - {exam?.title}</h1>
        <Link to="/faculty" className="btn-secondary">Back to Dashboard</Link>
      </div>

      <div className="card mb-6">
        <p className="text-gray-600 dark:text-gray-400">
          {questions.length} / {exam?.totalQuestions} questions added.
          {remaining > 0 && ` Add ${remaining} more.`}
        </p>
        {remaining > 0 && (
          <button onClick={handleBulkAdd} disabled={submitting} className="btn-secondary mt-2 text-sm">
            Add {Math.min(remaining, 5)} Sample Questions
          </button>
        )}
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('success') ? 'bg-green-100 dark:bg-green-900/30 text-green-700' : 'bg-red-100 dark:bg-red-900/30 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold mb-4">Add Single Question</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Question Text</label>
            <textarea
              name="questionText"
              value={form.questionText}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              required
              placeholder="Enter the question..."
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {['A', 'B', 'C', 'D'].map((opt) => (
              <div key={opt}>
                <label className="block text-sm font-medium mb-1">Option {opt}</label>
                <input
                  type="text"
                  name={`option${opt}`}
                  value={form[`option${opt}`]}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Correct Answer</label>
            <select
              name="correctAnswer"
              value={form.correctAnswer}
              onChange={handleChange}
              className="input-field"
            >
              <option value="a">A</option>
              <option value="b">B</option>
              <option value="c">C</option>
              <option value="d">D</option>
            </select>
          </div>
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Adding...' : 'Add Question'}
          </button>
        </form>
      </div>

      {questions.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Existing Questions</h2>
          <div className="space-y-2">
            {questions.map((q, i) => (
              <div key={q.id || i} className="card py-3">
                <p className="font-medium">{i + 1}. {q.questionText}</p>
                <p className="text-sm text-gray-500 mt-1">Correct: {q.correctAnswer?.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
