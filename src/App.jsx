 
import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { CRMProvider, useCRM } from './crm/CRMProvider.jsx';
import Home from './pages/Home.jsx'; import Services from './pages/Services.jsx';
import Training from './pages/Training.jsx'; import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx'; import Jobs from './pages/Jobs.jsx';
import Privacy from './pages/Privacy.jsx'; import Credits from './pages/Credits.jsx';
import Admin from './pages/Admin.jsx'; import Sidebar from './components/Sidebar.jsx';
import Chatbot from './components/Chatbot.jsx';
import SEO from './components/SEO.jsx';
import Background from './components/Background.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header"><div className="container header-inner">
      <a className="brand" href="/" aria-label="Home"><img src="/logo.svg" alt=""/><span className="brand-name">Happy Paws</span></a>
      <nav className="nav" aria-label="Primary">
        <NavLink to="/" end>Home</NavLink><NavLink to="/services">Services</NavLink>
        <NavLink to="/training">Training</NavLink><NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink><NavLink to="/jobs">Jobs</NavLink>
        <NavLink to="/admin">Admin</NavLink><a href="/privacy">Privacy</a><a href="/credits">Credits</a>
      </nav>
      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <a className="cta" href="/contact#reservations">Book Now</a>
        <button className="hamburger" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)}>☰</button>
      </div></div>
      {open && <div className="overlay" onClick={()=>setOpen(false)} aria-hidden="true"></div>}
      <div className={`drawer ${open?'open':''}`} role="dialog" aria-modal="true" aria-label="Mobile menu">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}><strong>Menu</strong>
          <button className="hamburger" aria-label="Close menu" onClick={()=>setOpen(false)}>✕</button></div>
        {['/','/services','/training','/about','/contact','/jobs','/admin','/privacy','/credits'].map((h,i)=>(
          <a key={i} href={h} onClick={()=>setOpen(false)}>{['Home','Services','Training','About','Contact','Jobs','Admin','Privacy','Site Credits'][i]}</a>
        ))}
        <a className="cta" href="/contact#reservations" onClick={()=>setOpen(false)}>Book Now</a>
      </div>
    </header>
  );
}

function Layout({ children, sections, pageKey }) {
  return (<>
    <SEO pageKey={pageKey} />
    <Background pageKey={pageKey} />
    <div className="container"><div className="main-grid">
      <aside className="aside"><div className="card"><div className="section-title">On this page</div><Sidebar sections={sections}/></div></aside>
      <main>{children}</main>
      <aside className="chat"><div className="card" style={{height:'100%',display:'flex',flexDirection:'column'}}>
        <div className="section-title">Ask Happy Paws</div><Chatbot/></div></aside>
    </div></div>
  </>);
}

function FooterVersion(){
  const { data } = useCRM();
  const v = data?.seo?.pages?.home?.title ? 'live' : 'default';
  return <div className="container">© {new Date().getFullYear()} Happy Paws — <span className="muted">content: {v}</span></div>;
}

export default function App(){
  return (<CRMProvider>
    <Header />
    <Routes>
      <Route path="/" element={<Layout pageKey="home" sections={[{id:'intro',label:'Intro'},{id:'mission',label:'Mission'},{id:'quicklinks',label:'Quick Links'}]}><Home/></Layout>} />
      <Route path="/services" element={<Layout pageKey="services" sections={[{id:'splash',label:'Splash Parks'},{id:'overnight',label:'Overnight Stays'},{id:'day',label:'Day Options'},{id:'bathing',label:'Self Bathing'},{id:'birthday',label:'Birthday Parties'},{id:'social',label:'Social Areas & 16 Tap'},{id:'events',label:'Events'},{id:'grooming',label:'Full Service Grooming'}]}><Services/></Layout>} />
      <Route path="/training" element={<Layout pageKey="training" sections={[{id:'group',label:'Group Obedience'},{id:'sport',label:'Sport/AKC/Fun'},{id:'puppy',label:'Puppy University'},{id:'private',label:'Private Lessons'},{id:'staytrain',label:'Stay-N-Train / Day-Train'},{id:'trainers',label:'Meet Trainers & Reviews'}]}><Training/></Layout>} />
      <Route path="/about" element={<Layout pageKey="about" sections={[{id:'team',label:'Management Team'},{id:'reviews',label:'Reviews'},{id:'different',label:"How We're Different"},{id:'gallery',label:'Photo Gallery'},{id:'mission',label:'Our Mission'},{id:'faqs',label:'FAQs'}]}><About/></Layout>} />
      <Route path="/contact" element={<Layout pageKey="contact" sections={[{id:'contact',label:'Contact Us'},{id:'reservations',label:'Reservations'}]}><Contact/></Layout>} />
      <Route path="/jobs" element={<Layout pageKey="jobs" sections={[{id:'careers',label:'Careers'}]}><Jobs/></Layout>} />
      <Route path="/privacy" element={<Layout pageKey="privacy" sections={[{id:'privacy',label:'Privacy Policy'}]}><Privacy/></Layout>} />
      <Route path="/credits" element={<Layout pageKey="credits" sections={[{id:'credits',label:'Site Credits'}]}><Credits/></Layout>} />
      <Route path="/admin" element={<div className="container" style={{padding:'20px 0'}}><Admin/></div>} />
      <Route path="*" element={<div className="container" style={{padding:'40px 0'}}><h1>404</h1><p>Page not found.</p></div>} />
    </Routes>
    <footer className="footer"><FooterVersion/></footer>
  </CRMProvider>);
}