import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, GraduationCap, Binary, Pen } from 'lucide-react';

const Home = () => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-slate-50 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />

      <div className="relative z-10 text-center px-4">
        <header className="mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-4">
             <span className="text-blue-600"> Emilien Valat</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Machine Learning Sotware Engineer.
          </p>
        </header>

        <nav className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
          <MenuCard 
            to="/resume" 
            title="Resume" 
            description="Academic background and professional journey."
            icon={<GraduationCap className="text-blue-600" size={28} />}
          />
          <MenuCard 
            to="/publications_page" 
            title="Publications" 
            description="Preprints and peer-reviewed papers."
            icon={<BookOpen className="text-blue-600" size={28} />}
          />
            <MenuCard 
            to="/curve_discretisation" 
            title="Geometric Deep-Learning Research" 
            description="Discretisation of data-acquisition trajectories."
            icon={<Binary className="text-blue-600" size={28} />}
          />
          {/* <MenuCard 
            to="/creative_writing" 
            title="Creative Writing" 
            description="What would you be up to if you were a beaver?"
            icon={<Pen className="text-blue-600" size={28} />}
          /> */}
        </nav>
      </div>
    </div>
  );
};

// Helper component for cleaner code and hover effects
const MenuCard = ({ to, title, description, icon }) => (
  <Link 
    to={to} 
    className="group p-8 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-start text-left"
  >
    <div className="mb-4 p-3 bg-blue-50 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm mb-6 flex-grow">{description}</p>
    <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
      Explore <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

export default Home;