import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { examAPI } from '../../services/api';

export default function CreateExam() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    duration: 30,
    createdById: 1 // Will be updated with actual user ID
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await examAPI.create(form);
      console.log('✅ Exam created:', data);
      alert('Exam created successfully! You can now add questions to this exam.');
      navigate(`/faculty/exam/${data.id}/questions`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create exam');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-primary-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-primary-950">
      <div className="max-w-xl mx-auto px-4 py-8 animate-slide-up">
      <h1 className="text-2xl font-bold mb-6">Create Exam</h1>
      <div className="card">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Exam Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="e.g. Midterm Exam - Mathematics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="input-field"
              rows="3"
              placeholder="Enter exam description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              className="input-field"
              min="1"
              required
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating...' : 'Create Exam & Add Questions'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}
