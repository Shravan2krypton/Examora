import { useState, useEffect } from 'react';
import { questionBankAPI } from '../../services/api';
import Modal from '../../components/Modal';

export default function QuestionBanks() {
  const [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activePdf, setActivePdf] = useState(null);

  useEffect(() => {
    questionBankAPI.getAll().then(({ data }) => setBanks(data)).finally(() => setLoading(false));
  }, []);

  const getPdfUrl = (url) => {
    if (url.startsWith('http')) return url;
    return url; // Proxy handles /uploads in dev
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
      <h1 className="text-2xl font-bold mb-8">Question Banks</h1>
      {banks.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">No question banks uploaded yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {banks.map((qb) => (
            <div key={qb.id} className="card flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{qb.subject}</h3>
                {qb.description && (
                  <p className="text-gray-600 dark:text-gray-400 mt-1">{qb.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded by {qb.uploadedBy?.name} • {new Date(qb.uploadDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setActivePdf({ url: getPdfUrl(qb.pdfUrl), subject: qb.subject })
                  }
                  className="btn-primary"
                >
                  View PDF
                </button>
                <a
                  href={getPdfUrl(qb.pdfUrl)}
                  download
                  className="btn-secondary"
                >
                  Download
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      <Modal
        isOpen={!!activePdf}
        title={activePdf?.subject || 'Question Bank'}
        onClose={() => setActivePdf(null)}
      >
        {activePdf && (
          <div className="h-[70vh] sm:h-[75vh] rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-900">
            <iframe
              src={activePdf.url}
              title={activePdf.subject}
              className="w-full h-full"
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
