import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ArrowRight, User, ChevronLeft, ChevronRight } from 'lucide-react';
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

const Home: FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchBlogs = async (page: number) => {
    setLoading(true);
    try {
      const response = await api.get(`/blogs/?page=${page}&limit=25`);
      setBlogs(response.data.items);
      setTotalPages(response.data.total_pages);
      setCurrentPage(response.data.page);
    } catch (err) {
      setError('Failed to connect to the TechEndeavor API.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && blogs.length === 0) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="w-full bg-white pb-24">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-18 px-6 sm:px-8">
        <div className="max-w-[1920px] mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-none">
              The Engineering <br />
              <span className="text-blue-500">Journal</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-400 font-medium max-w-2xl leading-relaxed">
              Where Today’s Reading Becomes Tomorrow’s Insight.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-5/6 mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        {error && (
          <div className="bg-red-50 border-2 border-red-100 p-6 mb-12 rounded-2xl flex items-center gap-4 text-red-700 font-bold">
            <span className="bg-red-500 text-white p-1 rounded-lg">!</span>
            {error}
          </div>
        )}

        {blogs.length === 0 && !error ? (
          <div className="text-center py-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-2xl font-black text-slate-400 uppercase tracking-widest">Feed is empty</p>
            <p className="text-slate-500 mt-2">Check back soon for new insights.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-12">
            {blogs.map((blog) => (
              <article 
                key={blog.id} 
                className="group flex flex-col md:flex-row gap-8 bg-white border-b border-slate-100 pb-12 hover:border-blue-100 transition-all"
              >
                <div className="w-full md:w-80 h-48 md:h-auto bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                   <div className="p-8 text-slate-200 group-hover:text-blue-200">
                      <Calendar size={64} strokeWidth={1} />
                   </div>
                </div>

                <div className="flex-grow flex flex-col justify-between py-2">
                  <div>
                    <div className="flex items-center gap-4 text-xs font-bold text-blue-600 uppercase tracking-widest mb-4">
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-slate-500 text-lg leading-relaxed line-clamp-2 max-w-4xl">
                      {blog.content}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                        <User size={14} className="text-slate-400" />
                      </div>
                      <span className="text-sm font-bold text-slate-700">{blog.author?.username || 'Guest Writer'}</span>
                    </div>
                    
                    <button 
                      onClick={() => navigate(`/blog/${blog.id}`)}
                      className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-tighter text-sm hover:gap-4 transition-all"
                    >
                      Read Full Article
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-20 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={20} />
              Prev
            </button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pgNo = i + 1;
                // Basic logic to show limited page numbers if totalPages is large
                if (
                  pgNo === 1 || 
                  pgNo === totalPages || 
                  (pgNo >= currentPage - 2 && pgNo <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={pgNo}
                      onClick={() => handlePageChange(pgNo)}
                      className={`w-12 h-12 rounded-xl font-bold transition-all ${
                        currentPage === pgNo 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                          : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {pgNo}
                    </button>
                  );
                } else if (pgNo === currentPage - 3 || pgNo === currentPage + 3) {
                  return <span key={pgNo} className="text-slate-400">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
