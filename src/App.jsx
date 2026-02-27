// path: src/App.jsx
import { Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { CRMProvider, useCRM } from './crm/CRMProvider.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Training from './pages/Training.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';
import Jobs from './pages/Jobs.jsx';
import Privacy from './pages/Privacy.jsx';
import Credits from './pages/Credits.jsx';
import Admin from './pages/Admin.jsx';
import Sidebar from './components/Sidebar.jsx';
import HoursCard from './components/HoursCard.jsx';
import Chatbot from './components/Chatbot.jsx';
import SEO from './components/SEO.jsx';
import Background from './components/Background.jsx';
import Progress from './pages/progress.jsx';
import Prices from './pages/Prices.jsx';

// NEW: offset-aware anchor scrolling
import ScrollOffsetProvider from './components/ScrollOffsetProvider.jsx';

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="header">
      <div className="container header-inner">
        <a className="brand" href="/" aria-label="Home">
         <img src="/logo.png" alt="" style={{ height: 48, width: 'auto' }} />
          <span className="brand-name">Meadow Ridge Pet Lodge</span>
        </a>

        <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/services">Services</NavLink>
          <NavLink to="/prices">Prices</NavLink> {/* ADD */}
          <NavLink to="/training">Training</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          {/* <NavLink to="/admin">Admin</NavLink>
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/credits">Credits</NavLink> */}
        </nav>

        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <a
        className="cta"
        href="https://booking.moego.pet/ol/landing?name=MeadowRidgePetLodge&fbclid=IwY2xjawQNe3pleHRuA2FlbQIxMQBicmlkETJFTENFZkpySWdaNnNFTlFJc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHry3dLHF3E4flvj6bRHn72UWYY8si9hMjU2_kIHd4inZK31t5sK8CO0fnEIf_aem_k8NfphjiYdgO7tgZ_E5-YQ"
        target="_blank"
        rel="noreferrer"
        onClick={()=>setOpen(false)}
      >
        Book Now
      </a>
          <button className="hamburger" aria-label="Open menu" aria-expanded={open} onClick={()=>setOpen(true)}>☰</button>
        </div>
      </div>

      {open && <div className="overlay" onClick={()=>setOpen(false)} aria-hidden="true"></div>}

      <div className={`drawer ${open?'open':''}`} role="dialog" aria-modal="true" aria-label="Mobile menu">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <strong>Menu</strong>
          <button className="hamburger" aria-label="Close menu" onClick={()=>setOpen(false)}>✕</button>
        </div>
        {['/','/services','/prices','/training','/about','/contact','/jobs'].map((h,i)=>(
  <a key={i} href={h} onClick={()=>setOpen(false)}>
    {['Home','Services','Prices','Training','About','Contact','Jobs'][i]}
  </a>
))}
        <a
          className="cta"
          href="https://booking.moego.pet/ol/landing?name=MeadowRidgePetLodge&fbclid=IwY2xjawQNe3pleHRuA2FlbQIxMQBicmlkETJFTENFZkpySWdaNnNFTlFJc3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHry3dLHF3E4flvj6bRHn72UWYY8si9hMjU2_kIHd4inZK31t5sK8CO0fnEIf_aem_k8NfphjiYdgO7tgZ_E5-YQ"
          target="_blank"
          rel="noreferrer"
        >
          Book Now
        </a>
      </div>
    </header>
  );
}

function Layout({ children, sections, pageKey }) {
  return (
    <>
      <SEO pageKey={pageKey} />
      <Background pageKey={pageKey} />
      <div className="container">
        <div className="main-grid">
          <aside className="aside">
            <div className="card">
              <div className="section-title">On this page</div>
              <Sidebar sections={sections}/>
            </div>
          </aside>

          <main>{children}</main>

          <aside className="chat">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <HoursCard />

          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="section-title">Ask Happy Paws</div>
            <Chatbot />
          </div>
        </div>
      </aside>
        </div>
      </div>
    </>
  );
}

function FooterVersion(){
  const { data } = useCRM();
  const v = data?.seo?.pages?.home?.title ? 'live' : 'default';
  return <div className="container">© {new Date().getFullYear()} Happy Paws — <span className="muted">content: {v}</span></div>;
}

// path: src/App.jsx (ADD this helper component somewhere above App())
function PricesRoute() {
  const { data } = useCRM();
  const services = Array.isArray(data?.services) ? data.services : [];
  const sections = services
    .map((s) => {
      const id = String(s?.id || s?.title || '').trim().toLowerCase().replace(/[^a-z0-9\-_]+/g, '-');
      if (!id) return null;
      return { id: `svc-${id}`, label: s?.title || 'Service' };
    })
    .filter(Boolean);

  return (
    <Layout pageKey="prices" sections={sections}>
      <Prices />
    </Layout>
  );
}

function App() {
  return (
    <CRMProvider>
      {/* Intercepts #anchor clicks + handles hash on load/route changes with sticky-header offset */}
      <ScrollOffsetProvider>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                pageKey="home"
                sections={[
                  {id:'intro',label:'Intro'},
                  {id:'mission',label:'Mission'},
                  {id:'quicklinks',label:'Quick Links'},
                ]}
              >
                <Home/>
              </Layout>
            }
          />
          <Route
            path="/services"
            element={
              <Layout
                pageKey="services"
                sections={[
                  {id:'splash',label:'Splash Parks'},
                  {id:'overnight',label:'Overnight Stays'},
                  {id:'day',label:'Day Options'},
                  {id:'bathing',label:'Self Bathing'},
                  {id:'birthday',label:'Birthday Parties'},
                  {id:'social',label:'Social Areas & 16 Tap'},
                  {id:'events',label:'Events'},
                  {id:'grooming',label:'Full Service Grooming'},
                ]}
              >
                <Services/>
              </Layout>
            }
          />
            <Route
              path="/prices"
              element={<PricesRoute />}
          />

          <Route
            path="/training"
            element={
              <Layout
                pageKey="training"
                sections={[
                  {id:'group',label:'Group Obedience'},
                  {id:'sport',label:'Sport/AKC/Fun'},
                  {id:'puppy',label:'Puppy University'},
                  {id:'private',label:'Private Lessons'},
                  {id:'staytrain',label:'Stay-N-Train / Day-Train'},
                  {id:'trainers',label:'Meet Trainers & Reviews'},
                ]}
              >
                <Training/>
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout
                pageKey="about"
                sections={[
                  {id:'team',label:'Management Team'},
                  {id:'different',label:'What Sets Meadow Ridge Apart?'},
                  {id:'gallery',label:'Photo Gallery'},
                  {id:'mission',label:'Our Mission'},
                  {id:'faqs',label:'FAQs'},
                ]}
              >
                <About/>
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout
                pageKey="contact"
                sections={[
                  {id:'contact',label:'Contact Us'},
                  {id:'reservations',label:'Reservations'},
                ]}
              >
                <Contact/>
              </Layout>
            }
          />
          <Route
            path="/jobs"
            element={
              <Layout
                pageKey="jobs"
                sections={[
                  {id:'careers',label:'Careers'},
                ]}
              >
                <Jobs/>
              </Layout>
            }
          />
          <Route
            path="/privacy"
            element={
              <Layout
                pageKey="privacy"
                sections={[
                  {id:'privacy',label:'Privacy Policy'},
                ]}
              >
                <Privacy/>
              </Layout>
            }
          />
          <Route
            path="/credits"
            element={
              <Layout
                pageKey="credits"
                sections={[
                  {id:'credits',label:'Site Credits'},
                ]}
              >
                <Credits/>
              </Layout>
            }
          />
          <Route path="/admin" element={<div className="container" style={{padding:'20px 0'}}><Admin/></div>} />
          <Route path="/progress" element={<Progress />} />
          <Route path="*" element={<div className="container" style={{padding:'40px 0'}}><h1>404</h1><p>Page not found.</p></div>} />
        </Routes>
        <footer className="footer"><FooterVersion/></footer>
      </ScrollOffsetProvider>
    </CRMProvider>
  );
}
export default App;
