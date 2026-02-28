import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import api from '../services/api';

interface Blog {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author?: {
    username: string;
  };
}

const BlogPost: FC = () => {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);
      } catch (err) {
        setError('Failed to load the article.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBlog();
    }
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error || !blog) return (
    <div className="max-w-4xl mx-auto py-20 px-6 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">{error || 'Article not found'}</h2>
      <button onClick={() => navigate('/')} className="text-blue-600 font-bold hover:underline">Back to Feed</button>
    </div>
  );

  return (
    <div className="w-full bg-white">
      <div className="max-w-4xl mx-auto py-16 px-6 sm:px-8">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold mb-12 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </button>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm font-bold text-blue-600 uppercase tracking-widest mb-6">
            <span>Engineering</span>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              {new Date(blog.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 leading-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 py-6 border-y border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <User size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Author</p>
              <p className="text-slate-900 font-bold">{blog.author?.username || 'TechEndeavor Writer'}</p>
            </div>
          </div>
        </header>

        <article className="prose prose-slate lg:prose-xl max-w-none">
          <div className="text-slate-700 leading-relaxed space-y-6 whitespace-pre-wrap">
            {blog.content}
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPost;
