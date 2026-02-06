import React, { useState, useMemo, useEffect } from 'react';
import { 
  Github, 
  Mail, 
  MapPin, 
  BookOpen, 
  Code, 
  Terminal, 
  Cpu, 
  Layers, 
  Languages, 
  Moon, 
  Sun,
  Download,
  ExternalLink,
  Search,
  Beaker,
  GraduationCap,
  Briefcase
} from 'lucide-react';

// --- STYLES ---
// Shared class for inline links within text
const linkStyles = "text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors";

// --- DATA ---
// HOW TO UPDATE LINKS:
// 1. Google Scholar: Go to your profile, copy the URL, and paste it into 'scholarUrl' below.
// 2. GitHub: If your username changes, update 'github' and 'githubUrl'.
// 3. Highlights: Use the format <>Text <a href="..." className={linkStyles}>Link</a> Text</>
//    Note the empty tags <> and </> wrapping the content.

const RESUME_DATA = {
  header: {
    name: "Emilien Valat",
    title: "Computer Vision Engineer & ML Researcher",
    location: "Pruszkow, Poland",
    email: "emilienvalat@gmail.com",
    github: "Emvlt",
    githubUrl: "https://github.com/Emvlt",
    scholar: "Google Scholar",
    scholarUrl: "https://scholar.google.fr/citations?hl=en&user=kkSBGOUAAAAJ", 
    lastUpdated: "Feb 2026"
  },
  summary: "Machine Learning Researcher and Engineer with a PhD in Engineering and a Master Degree in Optics. I specialise in deep learning methods for computational imaging. I have a proven expertise in developing novel neural network architectures and training procedures, and contributing to open-source scientific software.",
  skills: {
    programming: ["Python", "PyTorch", "PyGeom", "NumPy", "SciPy", "OpenCV", "Pandas", "Git", "uv"],
    cs: ["Imperative Programming", "Data Structures", "Functional Programming", "Algorithms"],
    devops: ["Apptainer", "Docker", "GitHub Workflows", "DVC", "AWS"],
    math: ["Discretization", "Calculus", "Optimisation", "Vector Calculus", "Statistics", "Linear Algebra"],
    languages: [
      { name: "English", level: "Fluent" },
      { name: "French", level: "Native" },
      { name: "Polish", level: "Basics" }
    ]
  },
  experience: [
    {
      id: "kth",
      role: "Post Doctoral Researcher",
      company: "Kungliga Tekniska Högskolan, Dept. of Mathematics",
      location: "Stockholm, Sweden",
      period: "Feb 2024 – Feb 2026",
      description: <>Research on geometric deep-learning for imaging and co-developer of <a href="https://github.com/odlgroup/odl" className={linkStyles} target="_blank" rel="noreferrer">ODL</a>.</>,
      highlights: [
        <>Created a geometry-aware neural network to increase robustness of tomographic imaging.</>,
        <>Developed a self-supervised pretraining method to address data scarcity in ML for Tomography.</>,
        <>Reverse-engineered the geometry of a tomographic scanner to use model-informed ML reconstruction.</>,
        <>Defined and executed the roadmap to move ODL from NumPy-only to a multi computational-backend library (Python Array-API, DLPack).</>,
        <>Automated testing, PyPi and documentation deployment with GitHub Workflows.</>,
        <>Mentoring Master and PhD students on ODL development.</>
      ],
      tags: ["Python", "ODL", "Geometric DL", "CI/CD", "Mentorship"]
    },
    {
      id: "cambridge",
      role: "Post Doctoral Researcher",
      company: "Cambridge University, Dept. of Applied Mathematics",
      location: "Cambridge, UK",
      period: "Jan 2023 – Jan 2024",
      description: "Researching the joint training of reconstruction and segmentation neural networks for CT medical imaging.",
      highlights: [
        <>Improved image segmentation model performance for low-dose CT using advanced joint-training techniques.</>,
        <>Developed a physics-informed neural network for medical imaging (ovarian cancer nodule segmentation).</>,
        <>Open source contributions to <a href="https://github.com/CERN/TIGRE" className={linkStyles} target="_blank" rel="noreferrer">TIGRE</a> and LION (PyTorch binders, dataloaders).</>
      ],
      tags: ["Medical Imaging", "PyTorch", "Physics-Informed NN", "Open Source"]
    },
    {
      id: "bristol",
      role: "Research Associate",
      company: "Bristol University, Dept. of Economics",
      location: "Bristol, UK",
      period: "July 2021 – Dec 2022",
      description: <>Computer Vision Scientist for the <a href="https://www.bristol.ac.uk/economics/research/impact-and-influence/mapping-history/" className={linkStyles} target="_blank" rel="noreferrer">MAPHIS</a> project.</>,
      highlights: [
        <>Developed a synthetic data generation tool for data augmentation in a data-scarce environment.</>,
        <>Defined, prepared and monitored data labelisation, curation and processing pipeline.</>,
        <>Developed a CV algorithm to segment urban landscape features from handmade maps.</>,
        <>Calculated commuting distances using A* pathfinding on extracted features.</>,
        <>Wrote a raster algorithm to turn map image scans into Slippy Tile format for Leaflet integration.</>
      ],
      tags: ["Computer Vision", "Synthetic Data", "A* Pathfinding", "Data Curation"]
    }
  ],
  education: [
    {
      degree: "PhD in Computer Science and Engineering",
      institution: "Southampton University",
      location: "Southampton, UK",
      period: "Jan 2019 – Jan 2023",
      details: "Thesis: 'Integrating Prior-Knowledge to X-Ray Computed Tomography Using Machine Learning'. Passed with Minor Corrections.",
      awards: ["Recipient of Turing Enrichment Scheme, 2022 Cohort - £1500"]
    },
    {
      degree: "MEng in Optical Engineering",
      institution: "Institut d'Optique Graduate School",
      location: "Palaiseau, France",
      period: "Sept 2013 – June 2018",
      details: "Photonic Systems Engineering, Wave Physics, Light Electromagnetism, Signal Processing. Erasmus semester in Stuttgart. Internships at Naval Group and CEA."
    }
  ],
  publications: [
    {
      title: "SDF, A self-supervised denoiser framework for X-Ray computed tomography",
      authors: "Emilien Valat, Andreas Hauptmann and Ozan Öktem",
      venue: "Applied Mathematics for Modern Challenges",
      date: "Sept 2025",
      doi: "10.3934/ammc.2025012",
      type: "Peer-Reviewed"
    },
    {
      title: "TIGRE v3, Efficient and easy to use iterative computed tomographic reconstruction toolbox for real datasets",
      authors: "Ander Biguri, Emilien Valat et al.",
      venue: "Engineering Research Express",
      date: "Mar 2025",
      doi: "10.1088/2631-8695/adbb3a",
      type: "Peer-Reviewed"
    },
    {
      title: "Empirical evidence of the task-adapted reconstruction framework for joint CT reconstruction and segmentation",
      authors: "Emilien Valat et al.",
      venue: "Applied Mathematics for Modern Challenges",
      date: "Sept 2024",
      doi: "10.3934/ammc.2024015",
      type: "Peer-Reviewed"
    },
    {
      title: "Sinogram Inpainting with Generative Adversarial Networks and Shape Priors",
      authors: "Emilien Valat, Katayoun Farrahi and Thomas Blumensath",
      venue: "Tomography",
      date: "June 2023",
      doi: "10.3390/tomography9030094",
      type: "Peer-Reviewed"
    },
    {
      title: "Improving the Generalization of Learned Reconstruction Frameworks",
      authors: "Emilien Valat and Ozan Öktem",
      venue: "arXiv",
      date: "Nov 2025",
      doi: "https://www.arxiv.org/abs/2511.12730",
      type: "Pre-Print"
    },
    {
      title: "HandCT, hands-on computational dataset for X-Ray Computed Tomography and Machine-Learning",
      authors: "Emilien Valat, and Loth Valat",
      venue: "arXiv",
      date: "Apr 2023",
      doi: "10.48550/arXiv.2304.14412",
      type: "Pre-Print"
    }
  ],
  interests: {
    writing: {
      title: "The Beavers (Novel)",
      period: "Sept 2023 – Present",
      desc: "Working towards a finished version of an anthropomorphic novel about beavers by 2026. Developed learned narration, story-telling and creative writing skills."
    }
  }
};

// --- COMPONENTS ---

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 uppercase tracking-wide">{title}</h2>
  </div>
);

const Tag = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 ${className}`}>
    {children}
  </span>
);

const SkillGroup = ({ title, skills, icon: Icon }) => (
  <div className="mb-4">
    <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 flex items-center gap-2">
      {Icon && <Icon className="w-4 h-4" />}
      {title}
    </h3>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span 
          key={skill} 
          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default border border-gray-200 dark:border-gray-700"
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Handle system preference on mount
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => setDarkMode(!darkMode);

  // Filter logic
  const filteredExperience = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.experience;
    const lowerQuery = searchQuery.toLowerCase();
    
    // Helper to get text from potential JSX elements
    const getText = (item) => {
      if (typeof item === 'string') return item.toLowerCase();
      if (React.isValidElement(item)) {
        // Simple extraction for now - assumes children are strings or arrays of strings/elements
        const extractText = (node) => {
           if (!node) return "";
           if (typeof node === 'string') return node;
           if (Array.isArray(node)) return node.map(extractText).join(" ");
           if (node.props && node.props.children) return extractText(node.props.children);
           return "";
        }
        return extractText(item).toLowerCase();
      }
      return "";
    };

    return RESUME_DATA.experience.filter(exp => 
      exp.role.toLowerCase().includes(lowerQuery) ||
      exp.company.toLowerCase().includes(lowerQuery) ||
      exp.description.toLowerCase().includes(lowerQuery) ||
      exp.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      exp.highlights.some(hl => getText(hl).includes(lowerQuery))
    );
  }, [searchQuery]);

  const filteredPublications = useMemo(() => {
    if (!searchQuery) return RESUME_DATA.publications;
    const lowerQuery = searchQuery.toLowerCase();
    return RESUME_DATA.publications.filter(pub => 
      pub.title.toLowerCase().includes(lowerQuery) ||
      pub.authors.toLowerCase().includes(lowerQuery) ||
      pub.venue.toLowerCase().includes(lowerQuery)
    );
  }, [searchQuery]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* --- CONTROLS --- */}
        <div className="flex justify-between items-center mb-8 print:hidden">
          <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <button 
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
              Full View
            </button>
            <button 
              onClick={() => setActiveTab("dev")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'dev' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
              Dev Focused
            </button>
            <button 
              onClick={() => setActiveTab("academic")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'academic' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
            >
              Research Focused
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
              <input 
                type="text"
                placeholder="Search keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 w-48 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button 
              onClick={handlePrint}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
              title="Print CV"
            >
              <Download className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* --- MAIN CV CARD --- */}
        <div className="bg-white dark:bg-slate-800 shadow-xl rounded-xl overflow-hidden print:shadow-none print:rounded-none">
          
          {/* HEADER */}
          <header className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">{RESUME_DATA.header.name}</h1>
                <p className="text-xl text-blue-300 font-medium">{RESUME_DATA.header.title}</p>
                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {RESUME_DATA.header.location}</span>
                  <a href={`mailto:${RESUME_DATA.header.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors"><Mail className="w-4 h-4" /> {RESUME_DATA.header.email}</a>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <a href={RESUME_DATA.header.githubUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-sm font-medium">
                  <Github className="w-4 h-4" /> github.com/{RESUME_DATA.header.github}
                </a>
                <a href={RESUME_DATA.header.scholarUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm text-sm font-medium">
                  <BookOpen className="w-4 h-4" /> Google Scholar
                </a>
                <div className="text-right text-xs text-slate-500 mt-2">
                  Updated: {RESUME_DATA.header.lastUpdated}
                </div>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* SIDEBAR (Skills & Info) */}
            <aside className="md:col-span-4 bg-gray-50 dark:bg-slate-800/50 p-6 md:p-8 border-r border-gray-100 dark:border-gray-700">
              
              <div className="mb-8">
                <SectionHeader icon={Terminal} title="Summary" />
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {RESUME_DATA.summary}
                </p>
              </div>

              {(activeTab === 'all' || activeTab === 'dev') && (
                <div className="mb-8">
                  <SectionHeader icon={Code} title="Tech Stack" />
                  <SkillGroup title="Languages & Libs" skills={RESUME_DATA.skills.programming} icon={Code} />
                  <SkillGroup title="DevOps & Cloud" skills={RESUME_DATA.skills.devops} icon={Layers} />
                  <SkillGroup title="Computer Science" skills={RESUME_DATA.skills.cs} icon={Cpu} />
                </div>
              )}

              {(activeTab === 'all' || activeTab === 'academic') && (
                <div className="mb-8">
                   <SectionHeader icon={Beaker} title="Mathematics" />
                   <div className="flex flex-wrap gap-2">
                    {RESUME_DATA.skills.math.map(m => (
                       <span key={m} className="text-xs text-gray-600 dark:text-gray-400 bg-white dark:bg-slate-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
                         {m}
                       </span>
                    ))}
                   </div>
                </div>
              )}

              <div className="mb-8">
                <SectionHeader icon={Languages} title="Languages" />
                <div className="space-y-2">
                  {RESUME_DATA.skills.languages.map(lang => (
                    <div key={lang.name} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-gray-700 dark:text-gray-300">{lang.name}</span>
                      <span className="text-gray-500 dark:text-gray-500">{lang.level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-bold uppercase text-gray-400 mb-2">Interests</h3>
                <div className="p-4 bg-white dark:bg-slate-700 rounded-lg shadow-sm border border-gray-100 dark:border-gray-600">
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{RESUME_DATA.interests.writing.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{RESUME_DATA.interests.writing.desc}</p>
                </div>
              </div>

            </aside>

            {/* MAIN CONTENT */}
            <main className="md:col-span-8 p-6 md:p-8">
              
              {/* EXPERIENCE */}
              <section className="mb-10">
                <SectionHeader icon={Briefcase} title="Experience" />
                <div className="space-y-8 relative">
                  {/* Timeline Line */}
                  <div className="absolute left-0 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                  
                  {filteredExperience.length === 0 && (
                     <div className="text-gray-500 italic p-4">No positions found matching "{searchQuery}"</div>
                  )}

                  {filteredExperience.map((job) => (
                    <div key={job.id} className="relative md:pl-8 group">
                      {/* Timeline Dot */}
                      <div className="absolute left-[-5px] top-2 w-3 h-3 rounded-full bg-blue-500 border-2 border-white dark:border-slate-800 hidden md:block group-hover:scale-125 transition-transform"></div>
                      
                      <div className="flex flex-col sm:flex-row justify-between sm:items-baseline mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {job.role}
                        </h3>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">{job.period}</span>
                      </div>
                      
                      <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-1">
                        {job.company} <span className="text-gray-400 font-normal mx-1">•</span> <span className="font-normal text-gray-500">{job.location}</span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mb-3">
                        {job.description}
                      </p>

                      <ul className="list-disc list-outside ml-4 space-y-1.5 mb-4 text-sm text-gray-700 dark:text-gray-300 marker:text-blue-500">
                        {job.highlights.map((highlight, idx) => (
                          <li key={idx} className="pl-2">
                            {highlight}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap gap-2">
                        {job.tags.map(tag => (
                          <Tag key={tag}>{tag}</Tag>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* EDUCATION */}
              {(activeTab === 'all' || activeTab === 'academic') && (
                <section className="mb-10 page-break-inside-avoid">
                  <SectionHeader icon={GraduationCap} title="Education" />
                  <div className="space-y-6">
                    {RESUME_DATA.education.map((edu, idx) => (
                      <div key={idx} className="bg-gray-50 dark:bg-slate-700/30 rounded-lg p-5 border border-gray-100 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between mb-2">
                          <h3 className="font-bold text-gray-900 dark:text-gray-100">{edu.degree}</h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{edu.period}</span>
                        </div>
                        <div className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-2">{edu.institution}, {edu.location}</div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.details}</p>
                        {edu.awards && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                             {edu.awards.map((award, i) => (
                               <div key={i} className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                                 <span className="text-yellow-500">★</span> {award}
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* PUBLICATIONS */}
              {(activeTab === 'all' || activeTab === 'academic') && (
                <section className="mb-6 page-break-inside-avoid">
                  <SectionHeader icon={BookOpen} title="Publications" />
                  
                  {filteredPublications.length === 0 && (
                     <div className="text-gray-500 italic p-4">No publications found matching "{searchQuery}"</div>
                  )}

                  <div className="grid gap-4">
                    {filteredPublications.map((pub, idx) => (
                      <div key={idx} className="group p-4 border border-gray-100 dark:border-gray-700 rounded-lg hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-md transition-all bg-white dark:bg-slate-800">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <a 
                              href={`https://doi.org/${pub.doi}`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1 hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors block"
                            >
                              {pub.title}
                            </a>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                              {pub.authors}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{pub.venue}</span>
                              <span>•</span>
                              <span>{pub.date}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${pub.type === 'Pre-Print' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                                {pub.type}
                              </span>
                            </div>
                          </div>
                          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Open DOI">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

            </main>
          </div>
        </div>
        
        <footer className="mt-8 text-center text-gray-500 text-sm pb-8 print:hidden">
          <p>© {new Date().getFullYear()} Emilien Valat. Built with React & Tailwind CSS.</p>
        </footer>

      </div>
      
      {/* Print Styles Injection */}
      <style>{`
        @media print {
          @page { margin: 0.5cm; }
          body { background: white !important; -webkit-print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:shadow-none { shadow: none !important; box-shadow: none !important; }
          .print\\:rounded-none { border-radius: 0 !important; }
          .page-break-inside-avoid { page-break-inside: avoid; }
        }
      `}</style>
    </div>
  );
}