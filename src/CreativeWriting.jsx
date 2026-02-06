import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, 
  PenTool, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Quote, 
  Library, 
  Compass, 
  Layers,
  ScrollText,
  Mail
} from 'lucide-react';

/**
 * THE AUTHOR'S NARRATIVE PORTFOLIO
 * An immersive React application designed to present fiction work 
 * through the lens of storytelling mechanics.
 */

const CREATIVE_WRITING = () => {
  const [activeSection, setActiveSection] = useState('prologue');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Update background styling state
      setIsScrolled(currentScrollY > 50);

      // Logic: Appear only when scrolling DOWN and past a threshold
      // Hide if scrolling UP or at the very top
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { id: 'prologue', label: 'Prologue', icon: <Compass size={18} /> },
    { id: 'mechanics', label: 'The Craft', icon: <Layers size={18} /> },
    { id: 'library', label: 'The Library', icon: <Library size={18} /> },
    { id: 'epilogue', label: 'Epilogue', icon: <Mail size={18} /> },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'prologue': return <PrologueSection onStart={() => setActiveSection('mechanics')} />;
      case 'mechanics': return <MechanicsSection />;
      case 'library': return <LibrarySection />;
      case 'epilogue': return <EpilogueSection />;
      default: return <PrologueSection />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF8] text-slate-900 font-serif selection:bg-amber-100">
      {/* Navigation Overlay - Now Visibility-aware */}
      <nav 
        className={`fixed top-0 w-full z-50 transform transition-all duration-500 ease-in-out ${
          isVisible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0'
        } ${
          isScrolled 
            ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setActiveSection('prologue')}>
            <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-full group-hover:rotate-12 transition-transform">
              <ScrollText size={20} />
            </div>
            <span className="font-bold tracking-tighter text-xl italic uppercase">Emilien Valat</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 text-sm font-sans font-medium uppercase tracking-widest transition-colors ${
                  activeSection === item.id ? 'text-amber-700' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pt-20">
        {renderSection()}
      </main>

      {/* Footer Branding */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="font-sans text-xs uppercase tracking-[0.3em] text-slate-400">
            Emilien Valat © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

/* --- SUB-COMPONENTS --- */

// 1. PROLOGUE: The Hero Section
const PrologueSection = ({ onStart }) => (
  <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-6 overflow-hidden">
    <div className="absolute inset-0 opacity-5 pointer-events-none select-none overflow-hidden flex items-center justify-center">
       <span className="text-[40rem] font-bold leading-none select-none">“</span>
    </div>

    <div className="relative z-10 max-w-4xl text-center">
      <h2 className="text-amber-700 font-sans font-bold uppercase tracking-[0.4em] mb-6 text-sm"></h2>
      <h1 className="text-6xl md:text-8xl font-black text-slate-900 leading-[1.1] mb-8">

        <span className="italic font-light">The Beavers</span>
      </h1>
      <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12 max-w-2xl mx-auto font-light italic">
        An anthropomorphic story of beavers, want-to-be heir of Redwall & Watership Downs
      </p>
      
      <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
        <button 
          onClick={onStart}
          className="px-10 py-4 bg-slate-900 text-white rounded-full font-sans font-bold uppercase tracking-widest text-xs hover:bg-amber-800 transition-all hover:scale-105 flex items-center gap-3"
        >
          Begin the Journey <ChevronRight size={16} />
        </button>
      </div>
    </div>

  </section>
);

// 2. MECHANICS: Explaining Storytelling
const MechanicsSection = () => {
  const [hoveredArc, setHoveredArc] = useState(null);

  const arcs = [
    { title: "Inciting Incident", desc: "The spark that disturbs the status quo.", icon: <Sparkles className="text-amber-500" /> },
    { title: "Rising Action", desc: "A series of complications building tension.", icon: <Layers className="text-blue-500" /> },
    { title: "The Climax", desc: "The point of no return. Absolute change.", icon: <Wind className="text-red-500" /> },
    { title: "Resolution", desc: "A new, altered peace is established.", icon: <ScrollText className="text-green-500" /> },
  ];

  return (
    <section className="py-24 max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
        <div>
          <h2 className="text-4xl font-bold mb-6 leading-tight">The Anatomy of <br /><span className="text-amber-700 italic">Narrative Arc</span></h2>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            Every manuscript I write follows a strict geometric tension. I treat character arcs as living functions—complex variables responding to external pressure until they reach their breaking point.
          </p>
          <div className="space-y-4">
            {arcs.map((arc, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setHoveredArc(idx)}
                className={`p-4 rounded-xl border transition-all cursor-default ${hoveredArc === idx ? 'bg-white shadow-md border-amber-200 translate-x-2' : 'border-transparent opacity-60'}`}
              >
                <div className="flex items-center gap-4">
                  {arc.icon}
                  <div>
                    <h4 className="font-bold text-slate-900">{arc.title}</h4>
                    <p className="text-sm text-slate-500">{arc.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="relative bg-slate-50 rounded-3xl p-8 border border-slate-100 aspect-square flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
          </div>
          <svg className="w-full h-64 overflow-visible" viewBox="0 0 400 200">
             {/* Freytag's Pyramid Visualization */}
             <path 
              d="M 20 180 Q 100 180 150 100 T 300 20 T 380 160" 
              fill="none" 
              stroke="#b45309" 
              strokeWidth="3" 
              strokeDasharray="1000"
              className="animate-draw"
            />
            <circle cx="20" cy="180" r="5" fill="#1e293b" />
            <circle cx="380" cy="160" r="5" fill="#1e293b" />
            <text x="20" y="195" fontSize="12" className="font-sans font-medium uppercase tracking-tighter">Start</text>
            <text x="340" y="175" fontSize="12" className="font-sans font-medium uppercase tracking-tighter">Legacy</text>
          </svg>
          <div className="mt-8 text-center px-6">
            <Quote className="mx-auto mb-4 text-slate-200" size={40} />
            <p className="italic text-slate-500">"My prose acts as the bridge between the logic of the world and the chaos of the heart."</p>
          </div>
        </div>
      </div>
    </section>
  );
};

// 3. LIBRARY: The Portfolio
const LibrarySection = () => {
  const [selectedBook, setSelectedBook] = useState(null);

  const works = [
    {
      id: 1,
      title: "The Ghost of Euclidean Space",
      genre: "Speculative Fiction",
      hook: "In a city where geometry defines social status, one woman discovers a curve that shouldn't exist.",
      year: "2023",
      cover: "bg-slate-800"
    },
    {
      id: 2,
      title: "Paper Wings & Iron Keys",
      genre: "Magical Realism",
      hook: "A locksmith finds he can open the hearts of houses, but never his own front door.",
      year: "2022",
      cover: "bg-amber-900"
    },
    {
      id: 3,
      title: "Silence of the Signal",
      genre: "Sci-Fi Thriller",
      hook: "The first message from Mars wasn't a hello—it was a warning to stop looking.",
      year: "2024",
      cover: "bg-indigo-900"
    }
  ];

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        <header className="mb-16">
          <h2 className="text-amber-700 font-sans font-bold uppercase tracking-[0.4em] mb-4 text-sm text-center">Current Volumes</h2>
          <h1 className="text-5xl font-black text-center">The Published Works</h1>
        </header>

        <div className="grid md:grid-cols-3 gap-8">
          {works.map((work) => (
            <div 
              key={work.id}
              onClick={() => setSelectedBook(work)}
              className="group cursor-pointer bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
            >
              <div className={`h-64 ${work.cover} relative flex items-center justify-center p-8 overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <Book className="text-white/20 absolute -right-4 -bottom-4 rotate-12" size={140} />
                <h3 className="relative z-10 text-white font-bold text-2xl text-center leading-tight">{work.title}</h3>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-sans font-bold uppercase tracking-widest text-amber-700 bg-amber-50 px-2 py-1 rounded">{work.genre}</span>
                  <span className="text-xs font-sans text-slate-400">{work.year}</span>
                </div>
                <p className="text-slate-600 italic leading-relaxed mb-6">"{work.hook}"</p>
                <div className="flex items-center gap-2 text-slate-900 font-sans font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                  Read Synopsis <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal-like Detail View (Simplified) */}
        {selectedBook && (
          <div className="mt-16 p-10 bg-white border border-amber-100 rounded-3xl shadow-xl flex flex-col md:flex-row gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className={`w-full md:w-1/3 h-80 rounded-xl ${selectedBook.cover} flex items-center justify-center p-8`}>
                <h2 className="text-white text-3xl font-bold text-center">{selectedBook.title}</h2>
             </div>
             <div className="flex-1">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-4xl font-black">{selectedBook.title}</h3>
                  <button onClick={() => setSelectedBook(null)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                    <ChevronLeft size={20} />
                  </button>
                </div>
                <div className="flex gap-4 mb-8">
                  <span className="font-sans text-xs font-bold uppercase text-slate-400 border border-slate-200 px-3 py-1 rounded-full">Hardcover</span>
                  <span className="font-sans text-xs font-bold uppercase text-slate-400 border border-slate-200 px-3 py-1 rounded-full">E-Book</span>
                  <span className="font-sans text-xs font-bold uppercase text-slate-400 border border-slate-200 px-3 py-1 rounded-full">Audio</span>
                </div>
                <p className="text-lg text-slate-600 leading-loose mb-8">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Proin gravida nibh vel velit auctor aliquet. Aenean sollicitudin, lorem quis bibendum auctor, nisi elit consequat ipsum, nec sagittis sem nibh id elit.
                </p>
                <button className="px-8 py-3 bg-slate-900 text-white rounded-lg font-sans font-bold text-xs uppercase tracking-widest hover:bg-amber-800 transition-colors">
                  Purchase the Manuscript
                </button>
             </div>
          </div>
        )}
      </div>
    </section>
  );
};

// 4. EPILOGUE: Contact
const EpilogueSection = () => (
  <section className="py-32 max-w-4xl mx-auto px-6 text-center">
    <div className="mb-12">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 text-amber-700">
        <PenTool size={32} />
      </div>
      <h2 className="text-5xl font-black mb-6">The Final Word</h2>
      <p className="text-xl text-slate-600 italic mb-12">
        "Every end is just the beginning of another character's backstory. Let's start a new chapter together."
      </p>
    </div>

    <div className="bg-slate-900 rounded-[3rem] p-12 text-white">
      <h3 className="font-sans font-bold uppercase tracking-widest mb-8">Correspondence</h3>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        <input 
          type="email" 
          placeholder="your.email@story.com" 
          className="px-8 py-4 bg-white/10 rounded-full border border-white/20 focus:outline-none focus:ring-2 focus:ring-amber-500 flex-1 md:max-w-xs font-sans"
        />
        <button className="px-10 py-4 bg-amber-600 text-white rounded-full font-sans font-bold uppercase tracking-widest text-xs hover:bg-amber-500 transition-all">
          Send a Letter
        </button>
      </div>
      <div className="mt-12 flex justify-center gap-8 text-white/50">
        <button className="hover:text-white transition-colors uppercase text-[10px] tracking-[0.3em] font-sans font-bold">Twitter</button>
        <button className="hover:text-white transition-colors uppercase text-[10px] tracking-[0.3em] font-sans font-bold">Substack</button>
        <button className="hover:text-white transition-colors uppercase text-[10px] tracking-[0.3em] font-sans font-bold">Goodreads</button>
      </div>
    </div>
  </section>
);

export default CREATIVE_WRITING;