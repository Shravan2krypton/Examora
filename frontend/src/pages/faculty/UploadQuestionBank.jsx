import { useState, useEffect } from 'react';
import { questionBankAPI } from '../../services/api';
import Modal from '../../components/Modal';

export default function UploadQuestionBank() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [banks, setBanks] = useState([]);
  const [activePdf, setActivePdf] = useState(null);

  useEffect(() => {
    questionBankAPI.getAll().then(({ data }) => setBanks(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a PDF file.');
      return;
    }
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed.');
      return;
    }
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('pdf', file);
      await questionBankAPI.upload(formData);
      setSuccess('Question bank uploaded successfully.');
      setTitle('');
      setDescription('');
      setFile(null);
      document.getElementById('pdf-input').value = '';
      questionBankAPI.getAll().then(({ data }) => setBanks(data));
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold mb-8">Upload Question Bank PDF</h1>
      <div className="card">
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm">
            {success}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                required
                placeholder="e.g. Mathematics"
              />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium mb-1">PDF File</label>
              <div
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl px-4 py-6 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50/40 dark:hover:bg-primary-900/10 transition-colors"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) setFile(f);
                }}
                onClick={() => document.getElementById('pdf-input')?.click()}
              >
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
                  {file ? file.name : 'Drag and drop a PDF here'}
                </p>
                <p className="text-xs text-gray-500 mt-1">or click to browse</p>
              </div>
              <input
                id="pdf-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0])}
                className="hidden"
                required={!file}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description (optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field min-h-[60px]"
              placeholder="Brief description of the question bank..."
            />
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </form>
      </div>

      {banks.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold mb-4">Uploaded Question Banks</h2>
          <div className="space-y-2">
            {banks.map((qb) => (
              <div key={qb.id} className="card flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{qb.title}</h3>
                  {qb.description && <p className="text-sm text-gray-500">{qb.description}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => setActivePdf({ url: `http://localhost:5000/uploads/${qb.file_path?.split('\\').pop() || qb.file_path}`, subject: qb.title })}
                  className="btn-secondary text-sm"
                >
                  Preview
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!activePdf}
        title={activePdf?.subject || 'Question Bank'}
        onClose={() => setActivePdf(null)}
        size="xl"
      >
        {activePdf && (
          <div className="h-[70vh] sm:h-[75vh] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-900">
            <iframe
              src={`${activePdf.url}#toolbar=0&navpanes=0&scrollbar=0`}
              title={activePdf.subject}
              className="w-full h-full"
              sandbox="allow-same-origin allow-scripts"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
