import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const CreateBlog: FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await api.post('/blogs/', { title, content });
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to create blog. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-8">Share Your Knowledge</h2>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Blog Title</label>
            <input
              type="text"
              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-lg font-medium"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g., The Future of React 19"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
            <textarea
              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[300px] leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your article here..."
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Publishing...' : 'Publish Post'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-slate-500 font-semibold hover:text-slate-700 px-6"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
