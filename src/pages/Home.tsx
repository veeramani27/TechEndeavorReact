import { useEffect, useState, useMemo } from 'react';
import type { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
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

  // Scroll restoration logic
  useEffect(() => {
    if (!loading && blogs.length > 0) {
      const lastId = sessionStorage.getItem('lastViewedBlogId');
      if (lastId) {
        const element = document.getElementById(`blog-${lastId}`);
        if (element) {
          // Use setTimeout to ensure DOM is ready and layout is stable
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'auto', block: 'center' });
            sessionStorage.removeItem('lastViewedBlogId');
          }, 100);
        }
      }
    }
  }, [loading, blogs]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReadArticle = (id: number) => {
    sessionStorage.setItem('lastViewedBlogId', id.toString());
    navigate(`/blog/${id}`);
  };

  const groupedBlogs = useMemo(() => {
    return blogs.reduce((acc, blog) => {
      const date = new Date(blog.created_at).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(blog);
      return acc;
    }, {} as Record<string, Blog[]>);
  }, [blogs]);

  if (loading && blogs.length === 0) return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="w-full bg-white pb-14">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-10 px-6 sm:px-8">
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
      <div className="max-w-5/6 mx-auto px-4 sm:px-6 lg:px-8 mt-10">
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
          <div className="space-y-8">
            {Object.entries(groupedBlogs).map(([date, groupBlogs]) => (
              <div key={date}>
                <div className="sticky top-16 bg-white/95 backdrop-blur-sm z-10 py-4 mb-4 border-b border-slate-100">
                   <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest">{date}</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {groupBlogs.map((blog) => (
                    <article 
                      key={blog.id} 
                      id={`blog-${blog.id}`}
                      className="group bg-white p-3 sm:p-5 rounded-2xl border border-slate-300 hover:border-blue-100 hover:shadow-lg transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                    >
                      <div className="flex-grow">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
                          {blog.title}
                        </h2>
                        <p className="text-slate-500 text-base sm:text-lg leading-relaxed line-clamp-2 max-w-4xl">
                          {blog.content}
                        </p>
                      </div>

                      <button 
                        onClick={() => handleReadArticle(blog.id)}
                        className="flex-shrink-0 flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-blue-500/30 whitespace-nowrap"
                      >
                        Read Full Article
                        <ArrowRight size={18} />
                      </button>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
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
