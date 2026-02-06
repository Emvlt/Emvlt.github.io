import React from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import HelixDiscretization from './HelixDiscretization';
import SCHOLAR_DATA from './PublicationsPage';
import RESUME_DATA from './ResumeData';
// import CREATIVE_WRITING from './CreativeWriting';

function App() {
  return (
    <HashRouter>
      {/* Optional: Navigation Bar visible on all pages */}
      <nav className="p-4 bg-white border-b border-slate-200 flex gap-4">
        <Link to="/" className="text-slate-600 hover:text-blue-600 font-bold">Home</Link>
        <Link to="/resume" className="text-slate-600 hover:text-blue-600 font-bold">Resume</Link>
        <Link to="/publications_page" className="text-slate-600 hover:text-blue-600 font-bold">Publications</Link>
        <Link to="/curve_discretisation" className="text-slate-600 hover:text-blue-600 font-bold">Project - Curve Discretization Engine</Link>
        {/* <Link to="/creative_writing" className="text-slate-600 hover:text-blue-600 font-bold">Creative Writing</Link> */}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/curve_discretisation" element={<HelixDiscretization />} />
        <Route path="/publications_page" element={<SCHOLAR_DATA />} />
        <Route path="/resume" element={<RESUME_DATA />} />
        {/* <Route path="/creative_writing" element={<CREATIVE_WRITING />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App;
