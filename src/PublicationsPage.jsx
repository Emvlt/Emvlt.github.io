import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, 
  ExternalLink, 
  Calendar, 
  User, 
  BookOpen, 
  ArrowUpDown,
  Award,
  BarChart3,
  Mail,
  MapPin,
  GraduationCap,
  Layers,
  Cpu,
  Database
} from 'lucide-react';

// Verified data for Emilien Valat (Computational Imaging Researcher)
const SCHOLAR_DATA = {
  name: "Emilien Valat",
  title: "Researcher in Machine Learning and Computational Imaging",
  institution: "LFW",
  location: "Warsaw",
  stats: {
    papers: "6",
    citations:"39",
    h_index:"3",
    focus: "Machine Learning and Computational Imaging",
    lab: "N/A",
    fields: ["Machine Learning", "Computer Vision", "Scientific Software Development", "Computed Tomography", "imaging"]
  },
  publications: [
    {
      title: "Improving the Generalisation of Learned Reconstruction Frameworks",
      authors: "E. Valat, O. Öktem",
      venue: "ArXiv",
      year: 2025,
      type: "Preprint",
      link: "https://arxiv.org/abs/2511.12730"
    },
    {
      title: "TIGRE v3: Efficient and easy to use iterative computed tomographic reconstruction toolbox for real datasets",
      authors: "A. Biguri, T. Sadakane, R. Lindroos, E. Valat, et al.",
      venue: "Engineering Research Express",
      year: 2025,
      type: "Article",
      link: "https://doi.org/10.1088/2631-8695/adbb3a"
    },
    {
      title: "SDF: A self-supervised denoiser framework for X-Ray computed tomography",
      authors: "E. Valat, A. Hauptmann, O. Öktem",
      venue: "Applied Mathematics for Modern Challenges, 5: 86-100",
      year: 2025,
      type: "Article",
      link: "https://www.aimsciences.org//article/doi/10.3934/ammc.2025012"
    },
    {
      title: "Empirical evidence of the task-adapted reconstruction framework for joint CT reconstruction and segmentation",
      authors: "E. Valat, A. Biguri, L. Escudero Sanchez, C. McCague, O. Öktem, C.B. Schönlieb",
      venue: "Applied Mathematics for Modern Challenges, 2(3): 287-300",
      year: 2024,
      type: "Article",
      link: "https://doi.org/10.3934/ammc.2024015"
    },
    {
      title: "Sinogram Inpainting with Generative Adversarial Networks and Shape Priors",
      authors: "E. Valat, K. Farrahi, T. Blumensath",
      venue: "Tomography, 9(3): 1137-1152",
      year: 2023,
      type: "Article",
      link: "https://www.mdpi.com/2379-139X/9/3/94"
    },
    {
      title: "HandCT: hands-on computational dataset for X-Ray Computed Tomography and Machine-Learning",
      authors: "E. Valat, et al.",
      venue: "Preprint",
      year: 2023,
      type: "Dataset",
      link: "https://arxiv.org/abs/2304.14412"
    },
  ]
};

const MetricCard = ({ icon: Icon, label, value, subtext, colorClass }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon size={20} className="text-white" />
      </div>
      <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{label}</span>
    </div>
    <div className="text-2xl font-bold text-slate-800">{value}</div>
    {subtext && <div className="text-sm text-slate-500 mt-1">{subtext}</div>}
  </div>
);

const PublicationCard = ({ pub }) => (
  <div className="group bg-white p-6 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 transition-all duration-200">
    <div className="flex flex-col md:flex-row justify-between gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
             pub.type === 'Article' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
           }`}>
             {pub.type}
           </span>
           <h3 className="text-lg font-semibold text-slate-800 group-hover:text-blue-700 leading-tight">
            {pub.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-slate-600 mb-2">
          <User size={14} />
          <p className="text-sm">{pub.authors}</p>
        </div>
        <div className="flex items-center gap-2 text-slate-500">
          <BookOpen size={14} />
          <p className="text-sm italic">{pub.venue}</p>
        </div>
      </div>
      
      <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-4 shrink-0">
        <div className="flex flex-col items-center md:items-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Year</span>
          <span className="flex items-center gap-1 text-slate-700 font-medium">
            <Calendar size={14} />
            {pub.year}
          </span>
        </div>
        <a 
          href={pub.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  </div>
);

export default function App() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("year");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredAndSortedPubs = useMemo(() => {
    return SCHOLAR_DATA.publications
      .filter(pub => 
        pub.title.toLowerCase().includes(search.toLowerCase()) ||
        pub.authors.toLowerCase().includes(search.toLowerCase()) ||
        pub.venue.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === "year") return b.year - a.year;
        return 0;
      });
  }, [search, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      {/* Header Section */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-white py-10'}`}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-100 rotate-2">
                EV
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
                  {SCHOLAR_DATA.name}
                </h1>
                <p className="text-blue-600 font-semibold flex items-center justify-center md:justify-start gap-2">
                  <GraduationCap size={18} />
                  {SCHOLAR_DATA.title}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-3">
                  <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin size={14} className="text-blue-500" />
                    {SCHOLAR_DATA.location}
                  </div>
                  {/* <div className="flex items-center gap-1.5 text-sm text-slate-500">
                    <Award size={14} className="text-amber-500" />
                    {SCHOLAR_DATA.institution}
                  </div> */}
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-3">
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12">
          <MetricCard 
            icon={Layers} 
            label="Verified Papers" 
            value={SCHOLAR_DATA.stats.papers} 
            colorClass="bg-blue-600" 
          />
          {/* <MetricCard 
            icon={Cpu} 
            label="Research Lab" 
            value={SCHOLAR_DATA.stats.lab} 
            subtext="Department of Mathematics"
            colorClass="bg-indigo-600" 
          /> */}
          <MetricCard 
            icon={Database} 
            label="Expertise" 
            value="ML/AI" 
            subtext="Computational Imaging"
            colorClass="bg-slate-800" 
          />
          <MetricCard 
            icon={BarChart3} 
            label="Citations" 
            value={SCHOLAR_DATA.stats.citations} 
            subtext="h-index: 3"
            colorClass="bg-emerald-600" 
          />
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Filter research by keyword, co-author, or venue..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center bg-slate-50 p-1 rounded-xl w-full md:w-auto">
            <button 
              onClick={() => setSortBy("year")}
              className={`flex items-center justify-center gap-2 px-6 py-2 rounded-lg text-sm font-semibold transition-all w-full md:w-auto ${sortBy === "year" ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ArrowUpDown size={14} />
              Sort by Year
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              Research & Publications
              <span className="text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {filteredAndSortedPubs.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredAndSortedPubs.map((pub, idx) => (
              <PublicationCard key={idx} pub={pub} />
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-6 mt-20 pt-8 border-t border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} {SCHOLAR_DATA.name} | Computational Imaging Researcher</p>
          <div className="flex gap-6">
            <a href="https://github.com/Emvlt" className="hover:text-slate-600 transition-colors">GitHub</a>
            <a href="https://www.linkedin.com/in/emilien-valat/" className="hover:text-slate-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}