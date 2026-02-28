import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateBlog from './pages/CreateBlog';
import BlogPost from './pages/BlogPost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/blog/:id" element={<BlogPost />} />
            </Routes>
          </main>
          <footer className="py-5 bg-slate-900 border-t border-slate-800 text-center">
            <div className="max-w-[1920px] mx-auto px-6">
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
                &copy; {new Date().getFullYear()} TechEndeavor Engineering. Built for the future.
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
