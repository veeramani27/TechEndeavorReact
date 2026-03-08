import { useState, useEffect } from 'react';
import type { FC, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const CreateBlog: FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        const blog = response.data;
        
        // Safety check: only allow author to edit
        if (user && blog.author_id !== user.id) {
          navigate(`/blog/${id}`);
          return;
        }

        setTitle(blog.title);
        setContent(blog.content);
      } catch (err) {
        console.error('Failed to fetch blog for editing:', err);
        setError('Failed to load blog data.');
      } finally {
        setFetching(false);
      }
    };

    if (isEditing && user) {
      fetchBlog();
    }
  }, [id, isEditing, navigate, user]);

  const handleEnhanceWithAI = async () => {
    if (!title || !content) {
      setError('Please provide both a title and content to enhance.');
      return;
    }

    setEnhancing(true);
    setError('');

    try {
      const response = await api.post('/blogs/enhance', { title, content });
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to enhance blog with AI.');
      console.error(err);
    } finally {
      setEnhancing(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await api.put(`/blogs/${id}`, { title, content });
        navigate(`/blog/${id}`);
      } else {
        await api.post('/blogs/', { title, content });
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || `Failed to ${isEditing ? 'update' : 'create'} blog. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-12 px-6">
      <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">
            {isEditing ? 'Edit Your Article' : 'Share Your Knowledge'}
          </h2>
          <button
            type="button"
            onClick={handleEnhanceWithAI}
            disabled={enhancing || !title || !content}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-4 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {enhancing ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            ) : (
              <Sparkles size={16} />
            )}
            {enhancing ? 'Enhancing...' : 'Enhance with AI'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-lg font-bold text-slate-700 mb-2">Blog Title</label>
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
            <label className="block text-lg font-bold text-slate-700 mb-2">Content (Markdown supported)</label>
            <textarea
              className="w-full px-5 py-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all min-h-[400px] font-mono text-sm leading-relaxed"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Write your article here using Markdown..."
            />
          </div>
          <div className="flex items-center gap-4 justify-end">
            <button
              type="button"
              onClick={() => isEditing ? navigate(`/blog/${id}`) : navigate('/')}
              className="text-slate-500 font-semibold hover:text-slate-700 px-6"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || enhancing}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? 'Updating...' : 'Publishing...') : (isEditing ? 'Save Changes' : 'Publish Post')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;

