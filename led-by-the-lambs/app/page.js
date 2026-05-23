'use client';
import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({
    first: '', last: '', email: '', phone: '',
    dest: '', style: 'Leisure / Relaxation',
    depart: '', ret: '', travelers: '', budget: '', notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.first || !form.last || !form.email) {
      alert('Please fill in your name and email.');
      return;
    }
    setSubmitting(true);
    try {
      await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch(e) {}
    setSubmitted(true);
    setSubmitting(false);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'DM Sans', sans-serif; color: #1E2D3D; background: #fff; }
        nav {
          position: relative;
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 48px;
          background: #0F1E30;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .nav-logo { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: #fff; letter-spacing: 0.01em; }
        .nav-logo span { color: #C8A84B; }
        .nav-links { display: flex; gap: 32px; }
        .nav-links a { color: rgba(255,255,255,0.8); font-size: 13px; font-weight: 500; text-decoration: none; letter-spacing: 0.05em; text-transform: uppercase; cursor: pointer; transition: color 0.2s; }
        .nav-links a:hover { color: #C8A84B; }
        .nav-cta { background: #C8A84B; color: #fff; border: none; padding: 10px 24px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; transition: background 0.2s; }
        .nav-cta:hover { background: #b5933c; }
        .logo-banner {
          background: #0F1E30;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 48px 80px 40px;
          border-bottom: 2px solid rgba(200,168,75,0.3);
          gap: 40px;
        }
        .logo-banner-img {
          width: 340px;
          height: 340px;
          object-fit: contain;
          flex-shrink: 0;
        }
        .logo-banner-quotes {
          display: flex;
          justify-content: center;
          gap: 80px;
          width: 100%;
          max-width: 1100px;
        }
        .logo-quote {
          flex: 1;
          max-width: 460px;
          font-family: 'Playfair Display', serif;
          font-size: 26px;
          font-style: italic;
          color: rgba(255,255,255,0.9);
          line-height: 1.5;
          text-align: center;
        }
        .logo-quote span {
          display: block;
          font-size: 14px;
          font-style: normal;
          color: #C8A84B;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-top: 16px;
        }
        .hero { position: relative; height: 100vh; min-height: 700px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background-image: url('/photos/hero.jpg'); background-size: cover; background-position: center 40%; filter: brightness(0.55); }
        .hero-content { position: relative; z-index: 2; text-align: center; padding: 0 24px; max-width: 820px; }
        .hero-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: #C8A84B; margin-bottom: 20px; }
        .hero-title { font-family: 'Playfair Display', serif; font-size: clamp(44px,7vw,80px); font-weight: 600; color: #fff; line-height: 1.1; margin-bottom: 24px; }
        .hero-title em { color: #C8A84B; font-style: italic; }
        .hero-sub { font-size: clamp(16px,2vw,20px); color: rgba(255,255,255,0.85); line-height: 1.6; margin-bottom: 40px; font-weight: 300; }
        .hero-btns { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn-gold { background: #C8A84B; color: #fff; border: none; padding: 16px 36px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-gold:hover { background: #b5933c; transform: translateY(-1px); }
        .btn-outline { background: transparent; color: #fff; border: 1.5px solid rgba(255,255,255,0.6); padding: 16px 36px; border-radius: 4px; font-size: 14px; font-weight: 600; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.1); }
        .stats-bar { background: #1A4F82; padding: 48px; display: grid; grid-template-columns: repeat(4,1fr); gap: 0; }
        .stat-item { text-align: center; padding: 0 24px; border-right: 1px solid rgba(255,255,255,0.15); }
        .stat-item:last-child { border-right: none; }
        .stat-num { font-family: 'Playfair Display', serif; font-size: 48px; font-weight: 500; color: #C8A84B; line-height: 1; }
        .stat-label { font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 8px; letter-spacing: 0.08em; text-transform: uppercase; }
        section { padding: 100px 48px; }
        .section-eyebrow { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: #C8A84B; margin-bottom: 14px; }
        .section-title { font-family: 'Playfair Display', serif; font-size: clamp(32px,4vw,52px); font-weight: 500; line-height: 1.15; color: #1E2D3D; }
        .section-title em { color: #4A90D9; font-style: italic; }
        .divider { width: 48px; height: 2px; background: #C8A84B; margin: 24px 0 32px; }
        .about-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .about-img-wrap { position: relative; }
        .about-img { width: 100%; aspect-ratio: 4/5; object-fit: cover; border-radius: 2px; }
        .about-img-accent { position: absolute; bottom: -24px; right: -24px; width: 60%; aspect-ratio: 1; background: #1A4F82; z-index: -1; border-radius: 2px; }
        .about-gold-box { background: #C8A84B; color: #fff; padding: 20px 28px; margin-top: 32px; border-radius: 2px; font-size: 15px; line-height: 1.6; font-style: italic; font-family: 'Playfair Display', serif; }
        .about-text p { font-size: 16px; line-height: 1.8; color: #4A5568; margin-bottom: 16px; }
        .about-tags { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .photo-strip { overflow: hidden; height: 300px; position: relative; }
        .photo-strip-track { display: flex; height: 100%; animation: scrollStrip 40s linear infinite; width: max-content; }
        .photo-strip-track:hover { animation-play-state: paused; }
        @keyframes scrollStrip { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .photo-strip-item { width: 320px; flex-shrink: 0; overflow: hidden; position: relative; margin-right: 4px; }
        .photo-strip-item img { width: 100%; height: 100%; object-fit: cover; transition: filter 0.3s; filter: brightness(0.85); }
        .photo-strip-item:hover img { filter: brightness(1); }
        .dest-grid { max-width: 1200px; margin: 48px auto 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
        .lamb-accent { display: flex; align-items: center; justify-content: center; gap: 48px; padding: 48px; background: #0F1E30; border-top: 1px solid rgba(200,168,75,0.2); }
        .lamb-accent img { width: 180px; height: 180px; object-fit: cover; border-radius: 50%; opacity: 0.85; border: 2px solid rgba(200,168,75,0.4); }
        .lamb-accent-text { font-family: 'Playfair Display', serif; font-size: 24px; font-style: italic; color: rgba(255,255,255,0.75); letter-spacing: 0.05em; }
        .dest-card { position: relative; height: 340px; overflow: hidden; border-radius: 4px; cursor: pointer; }
        .dest-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; filter: brightness(0.75); }
        .dest-card:hover img { transform: scale(1.06); filter: brightness(0.9); }
        .dest-card-label { position: absolute; bottom: 0; left: 0; right: 0; padding: 32px 24px 20px; background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%); }
        .dest-card-title { font-family: 'Playfair Display', serif; font-size: 22px; color: #fff; font-weight: 500; }
        .dest-card-sub { font-size: 12px; color: rgba(255,255,255,0.7); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
        .tag { background: #EEF7FF; color: #1A4F82; padding: 6px 16px; border-radius: 20px; font-size: 13px; font-weight: 500; }
        .gallery-section { background: #F8F6F1; }
        .gallery-header { max-width: 1200px; margin: 0 auto 48px; }
        .gallery-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr; grid-template-rows: 300px 300px; gap: 12px; }
        .gallery-item { overflow: hidden; border-radius: 2px; position: relative; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .gallery-item:hover img { transform: scale(1.04); }
        .gallery-item.tall { grid-row: span 2; }
        .gallery-caption { position: absolute; bottom: 0; left: 0; right: 0; background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%); padding: 20px 16px 14px; color: rgba(255,255,255,0.9); font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; }
        .why-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(3,1fr); gap: 48px; }
        .why-item { text-align: center; }
        .why-icon { width: 72px; height: 72px; border-radius: 50%; background: transparent; border: 2px solid #C8A84B; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .why-title { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 500; margin-bottom: 12px; }
        .why-text { font-size: 15px; color: #6B8299; line-height: 1.7; }
        .form-section { background: linear-gradient(135deg, #1A4F82 0%, #2C6FAC 100%); padding: 100px 48px; }
        .form-wrap { max-width: 800px; margin: 0 auto; }
        .form-section .section-title { color: #fff; }
        .form-section .section-eyebrow { color: #C8A84B; }
        .form-section .divider { background: rgba(255,255,255,0.3); }
        .form-section p { color: rgba(255,255,255,0.75); margin-bottom: 40px; font-size: 16px; line-height: 1.7; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group.full { grid-column: 1 / -1; }
        .form-label { font-size: 11px; font-weight: 600; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.1em; }
        .form-input, .form-select, .form-textarea { font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 13px 16px; border: 1px solid rgba(255,255,255,0.2); border-radius: 4px; background: rgba(255,255,255,0.1); color: #fff; outline: none; transition: all 0.2s; width: 100%; }
        .form-input::placeholder, .form-textarea::placeholder { color: rgba(255,255,255,0.4); }
        .form-input:focus, .form-select:focus, .form-textarea:focus { border-color: #C8A84B; background: rgba(255,255,255,0.15); }
        .form-select option { background: #1A4F82; color: #fff; }
        .form-textarea { resize: vertical; min-height: 100px; }
        .submit-btn { width: 100%; margin-top: 24px; background: #C8A84B; color: #fff; border: none; padding: 18px; border-radius: 4px; font-size: 15px; font-weight: 700; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
        .submit-btn:hover { background: #b5933c; transform: translateY(-1px); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
        .success-box { text-align: center; padding: 60px 40px; background: rgba(255,255,255,0.1); border-radius: 8px; border: 1px solid rgba(255,255,255,0.2); }
        .success-icon { font-size: 56px; margin-bottom: 20px; }
        .success-box h3 { font-family: 'Playfair Display', serif; font-size: 32px; color: #fff; margin-bottom: 16px; }
        .success-box p { color: rgba(255,255,255,0.8); font-size: 16px; line-height: 1.7; }
        .lifestyle-section { background: #1E2D3D; padding: 100px 48px; }
        .lifestyle-section .section-title { color: #fff; }
        .lifestyle-section .section-eyebrow { color: #C8A84B; }
        .lifestyle-section .divider { background: rgba(255,255,255,0.2); }
        .lifestyle-grid { max-width: 1200px; margin: 48px auto 0; display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center; }
        .lifestyle-img { width: 100%; border-radius: 2px; object-fit: cover; max-height: 600px; }
        .lifestyle-text p { color: rgba(255,255,255,0.75); font-size: 16px; line-height: 1.8; margin-bottom: 16px; }
        .quote { font-family: 'Playfair Display', serif; font-size: 22px; color: #C8A84B; font-style: italic; border-left: 3px solid #C8A84B; padding-left: 20px; margin: 24px 0; }
        footer { background: #0F1E30; padding: 48px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px; }
        .footer-logo { display: flex; align-items: center; gap: 12px; }
        .footer-logo img { height: 60px; width: 60px; object-fit: contain; border-radius: 50%; background: #fff; padding: 2px; }
        .footer-logo-text { font-family: 'Playfair Display', serif; font-size: 16px; color: #fff; font-weight: 600; }
        .footer-logo-text span { color: #C8A84B; }
        .footer-tagline { font-size: 13px; color: rgba(255,255,255,0.4); margin-top: 4px; }
        .footer-links { display: flex; gap: 24px; }
        .footer-links a { color: rgba(255,255,255,0.5); font-size: 13px; text-decoration: none; cursor: pointer; transition: color 0.2s; }
        .footer-links a:hover { color: #C8A84B; }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.3); }
        @media (max-width: 768px) {
          nav { padding: 16px 24px; }
          .nav-links { display: none; }
          section { padding: 72px 24px; }
          .stats-bar { grid-template-columns: 1fr 1fr; padding: 40px 24px; gap: 32px; }
          .stat-item { border-right: none; }
          .about-grid, .lifestyle-grid, .why-grid { grid-template-columns: 1fr; gap: 40px; }
          .gallery-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
          .gallery-item.tall { grid-row: span 1; }
          .form-grid { grid-template-columns: 1fr; }
          .form-section { padding: 72px 24px; }
          footer { flex-direction: column; align-items: flex-start; padding: 40px 24px; }
        }
      `}</style>

      <nav>
        <div className="nav-logo">The Roaming <span>Lamb</span></div>
        <div className="nav-links">
          <a onClick={() => scrollTo('about')}>About</a>
          <a onClick={() => scrollTo('destinations')}>Destinations</a>
          <a onClick={() => scrollTo('why')}>Why Us</a>
          <a onClick={() => scrollTo('contact')}>Contact</a>
        </div>
        <button className="nav-cta" onClick={() => scrollTo('contact')}>Plan My Trip</button>
      </nav>

      <div className="logo-banner">
        <img src="/photos/logo.png" alt="The Roaming Lamb Travel Co." className="logo-banner-img" />
        <div className="logo-banner-quotes">
          <div className="logo-quote">
            "Not all those who wander are lost."
            <span>— J.R.R. Tolkien</span>
          </div>
          <div className="logo-quote">
            "We travel not to escape life, but for life not to escape us."
            <span>— Unknown</span>
          </div>
        </div>
      </div>
      <div className="lamb-accent">
        <img src="/photos/lamb-carving.jpg" alt="Roaming Lamb carving" />
        <div className="lamb-accent-text">Found in the Vatican — a roaming lamb, carved in stone.</div>
        <img src="/photos/lamb-carving.jpg" alt="Roaming Lamb carving" />
      </div>

      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-eyebrow">Personalized Travel Planning</div>
          <h1 className="hero-title">Your Dream Adventure<br /><em>Awaits.</em></h1>
          <p className="hero-sub">We're Justin & Casondra Lamb — passionate travelers turned travel planners.<br />Let us craft the trip of a lifetime, so all you have to do is show up.</p>
          <div className="hero-btns">
            <button className="btn-gold" onClick={() => scrollTo('contact')}>Start Planning Your Trip</button>
            <button className="btn-outline" onClick={() => scrollTo('about')}>Meet the Lambs</button>
          </div>
        </div>
      </div>

      <div className="stats-bar">
        {[['15+','Countries Explored'],['100+','Trips Planned'],['5★','Client Rating'],['0','Trips We Wouldn\'t Take Ourselves']].map(([n,l]) => (
          <div key={l} className="stat-item"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      <section id="about" style={{background:'#fff'}}>
        <div className="about-grid">
          <div className="about-img-wrap">
            <img src="/photos/about.jpg" alt="Justin and Casondra Lamb" className="about-img" />
            <div className="about-img-accent" />
          </div>
          <div className="about-text">
            <div className="section-eyebrow">Meet Your Planners</div>
            <h2 className="section-title">We Don't Just Plan Trips.<br /><em>We Live Them.</em></h2>
            <div className="divider" />
            <p>Hi, we're Justin & Casondra Lamb — a couple from Knoxville, Tennessee who turned a lifelong passion for travel into a personalized travel planning business.</p>
            <p>From the cobblestone streets of Rome to the Mediterranean coast, from Times Square to the Las Vegas Strip — we've experienced it firsthand. That's exactly what we bring to every trip we plan for you.</p>
            <p>Combining years of customer service and hospitality experience, we believe travel should be effortless, memorable, and deeply personal. We handle every detail — flights, hotels, experiences, reservations — so you can focus on what travel is all about...making memories.</p>
            <div className="about-tags">
              {['Rome & Amalfi Coast','Mediterranean Cruise','Barcelona','Las Vegas','New York City','Caribbean'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
            <div className="about-gold-box">"We've been where you want to go — and we can't wait to help you get there."</div>
          </div>
        </div>
      </section>

      {/* Scrolling Photo Strip */}
      <div className="photo-strip">
        <div className="photo-strip-track">
          {[
            {src:'/photos/strip1.jpg', alt:'Sloth encounter'},
            {src:'/photos/strip2.jpg', alt:'Icebar'},
            {src:'/photos/strip3.jpg', alt:'Caribbean boat'},
            {src:'/photos/scroll1.jpg', alt:'Sea lion'},
            {src:'/photos/scroll2.jpg', alt:'Tortola BVI'},
            {src:'/photos/scroll3.jpg', alt:'Dominican Republic'},
            {src:'/photos/scroll5.jpg', alt:'Philadelphia'},
            {src:'/photos/scroll6.jpg', alt:'Christmas market'},
            {src:'/photos/scroll7.jpg', alt:'Pig beach'},
            {src:'/photos/scroll8.jpg', alt:'Pig at table'},
            {src:'/photos/scroll-sagrada-blue.jpg', alt:'Sagrada Familia stained glass'},
            {src:'/photos/scroll-sagrada-orange.jpg', alt:'Sagrada Familia interior'},
            {src:'/photos/scroll-marseille-church.jpg', alt:'Marseille church interior'},
            {src:'/photos/scroll-sicily-umbrellas.jpg', alt:'Sicily umbrella street'},
            {src:'/photos/scroll-marseille-tower.jpg', alt:'Notre-Dame de la Garde'},
            {src:'/photos/scroll-marseille-selfie.jpg', alt:'Marseille overlook'},
            {src:'/photos/scroll-med-boat.jpg', alt:'Mediterranean boat'},
            {src:'/photos/scroll-colosseum-interior.jpg', alt:'Colosseum interior'},
            {src:'/photos/scroll-vatican-dome.jpg', alt:'Vatican dome ceiling'},
            {src:'/photos/scroll-colosseum-couple.jpg', alt:'Colosseum couple'},
            {src:'/photos/scroll-taliesin-living.jpg', alt:'Taliesin West living room'},
            {src:'/photos/scroll-taliesin-theater.jpg', alt:'Taliesin West theater'},
            {src:'/photos/scroll-turtle.jpg', alt:'Turtle'},
            {src:'/photos/scroll-az-balcony.jpg', alt:'Arizona resort balcony'},
            {src:'/photos/scroll-barcelona-beer.jpg', alt:'Casondra Barcelona beer'},
            {src:'/photos/scroll-justin-beer.jpg', alt:'Justin Barcelona beer'},
            {src:'/photos/scroll-diamondbacks.jpg', alt:'Diamondbacks game'},
            {src:'/photos/scroll-florence-selfie.jpg', alt:'Florence overlook selfie'},
            {src:'/photos/scroll-casa-batllo.jpg', alt:'Casa Batllo Barcelona'},
            {src:'/photos/scroll-chateau-if.jpg', alt:'Chateau d\'If Marseille'},
            {src:'/photos/scroll-vatican-frescoes.jpg', alt:'Vatican frescoes'},
            // Duplicate set for seamless loop
            {src:'/photos/strip1.jpg', alt:'Sloth encounter'},
            {src:'/photos/strip2.jpg', alt:'Icebar'},
            {src:'/photos/strip3.jpg', alt:'Caribbean boat'},
            {src:'/photos/scroll1.jpg', alt:'Sea lion'},
            {src:'/photos/scroll2.jpg', alt:'Tortola BVI'},
            {src:'/photos/scroll3.jpg', alt:'Dominican Republic'},
            {src:'/photos/scroll5.jpg', alt:'Philadelphia'},
            {src:'/photos/scroll6.jpg', alt:'Christmas market'},
            {src:'/photos/scroll7.jpg', alt:'Pig beach'},
            {src:'/photos/scroll8.jpg', alt:'Pig at table'},
            {src:'/photos/scroll-sagrada-blue.jpg', alt:'Sagrada Familia stained glass'},
            {src:'/photos/scroll-sagrada-orange.jpg', alt:'Sagrada Familia interior'},
            {src:'/photos/scroll-marseille-church.jpg', alt:'Marseille church interior'},
            {src:'/photos/scroll-sicily-umbrellas.jpg', alt:'Sicily umbrella street'},
            {src:'/photos/scroll-marseille-tower.jpg', alt:'Notre-Dame de la Garde'},
            {src:'/photos/scroll-marseille-selfie.jpg', alt:'Marseille overlook'},
            {src:'/photos/scroll-med-boat.jpg', alt:'Mediterranean boat'},
            {src:'/photos/scroll-colosseum-interior.jpg', alt:'Colosseum interior'},
            {src:'/photos/scroll-vatican-dome.jpg', alt:'Vatican dome ceiling'},
            {src:'/photos/scroll-colosseum-couple.jpg', alt:'Colosseum couple'},
            {src:'/photos/scroll-taliesin-living.jpg', alt:'Taliesin West living room'},
            {src:'/photos/scroll-taliesin-theater.jpg', alt:'Taliesin West theater'},
            {src:'/photos/scroll-turtle.jpg', alt:'Turtle'},
            {src:'/photos/scroll-az-balcony.jpg', alt:'Arizona resort balcony'},
            {src:'/photos/scroll-barcelona-beer.jpg', alt:'Casondra Barcelona beer'},
            {src:'/photos/scroll-justin-beer.jpg', alt:'Justin Barcelona beer'},
            {src:'/photos/scroll-diamondbacks.jpg', alt:'Diamondbacks game'},
            {src:'/photos/scroll-florence-selfie.jpg', alt:'Florence overlook selfie'},
            {src:'/photos/scroll-casa-batllo.jpg', alt:'Casa Batllo Barcelona'},
            {src:'/photos/scroll-chateau-if.jpg', alt:'Chateau d\'If Marseille'},
            {src:'/photos/scroll-vatican-frescoes.jpg', alt:'Vatican frescoes'},
          ].map((p, i) => (
            <div key={i} className="photo-strip-item">
              <img src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>
      </div>

      <section id="destinations" className="gallery-section">
        <div className="gallery-header">
          <div className="section-eyebrow">Where We've Been</div>
          <h2 className="section-title">The World Is Waiting.<br /><em>Where Will You Go?</em></h2>
          <div className="divider" />
        </div>
        <div className="dest-grid">
          <div className="dest-card"><img src="/photos/dest-rome.jpg" alt="Rome, Italy" /><div className="dest-card-label"><div className="dest-card-title">Rome & the Vatican</div><div className="dest-card-sub">Italy</div></div></div>
          <div className="dest-card"><img src="/photos/gallery1.jpg" alt="Caribbean" /><div className="dest-card-label"><div className="dest-card-title">Caribbean Islands</div><div className="dest-card-sub">BVI · USVI · Dominican Republic</div></div></div>
          <div className="dest-card"><img src="/photos/dest-barcelona.jpg" alt="Barcelona, Spain" /><div className="dest-card-label"><div className="dest-card-title">Barcelona</div><div className="dest-card-sub">Spain</div></div></div>
          <div className="dest-card"><img src="/photos/dest-marseille.jpg" alt="Marseille, France" /><div className="dest-card-label"><div className="dest-card-title">Marseille</div><div className="dest-card-sub">France</div></div></div>
          <div className="dest-card"><img src="/photos/dest-sicily.jpg" alt="Sicily, Italy" /><div className="dest-card-label"><div className="dest-card-title">Sicily</div><div className="dest-card-sub">Italy</div></div></div>
          <div className="dest-card"><img src="/photos/dest-nyc.jpg" alt="New York City" /><div className="dest-card-label"><div className="dest-card-title">New York City</div><div className="dest-card-sub">New York</div></div></div>
          <div className="dest-card"><img src="/photos/dest-scottsdale.jpg" alt="Scottsdale, Arizona" /><div className="dest-card-label"><div className="dest-card-title">Scottsdale</div><div className="dest-card-sub">Arizona</div></div></div>
          <div className="dest-card"><img src="/photos/dest-derby.jpg" alt="Kentucky Derby" /><div className="dest-card-label"><div className="dest-card-title">Kentucky Derby</div><div className="dest-card-sub">Louisville, Kentucky</div></div></div>
          <div className="dest-card"><img src="/photos/dest-adventure.jpg" alt="Adventure Awaits" /><div className="dest-card-label"><div className="dest-card-title">Adventure Awaits...</div><div className="dest-card-sub">Where will you go next?</div></div></div>
        </div>
      </section>

      <section id="why" style={{background:'#fff'}}>
        <div style={{textAlign:'center', marginBottom:64}}>
          <div className="section-eyebrow">Why The Roaming Lamb</div>
          <h2 className="section-title">Travel Planning That's<br /><em>Actually Personal</em></h2>
          <div className="divider" style={{margin:'24px auto 0'}} />
        </div>
        <div className="why-grid">
          {[
            {icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C8A84B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 26L14 18M26 6l-8 8M20 6h6v6M12 26H6v-6"/><circle cx="16" cy="16" r="3"/></svg>, title:"We've Been There", text:"Every destination we recommend is one we've personally explored. No guessing, no generic itineraries — just real, firsthand knowledge."},
            {icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C8A84B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4C9.4 4 4 9.4 4 16s5.4 12 12 12 12-5.4 12-12S22.6 4 16 4z"/><path d="M16 10v6l4 2"/></svg>, title:'Tailored to You', text:"No two trips are the same. We take the time to understand your style, budget, and bucket list before crafting a single recommendation."},
            {icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#C8A84B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4l2.5 7.5H26l-6.5 4.5 2.5 7.5L16 19l-6 4.5 2.5-7.5L6 11.5h7.5z"/></svg>, title:'Full White-Glove Service', text:'From flights and hotels to dining reservations and day trips — we handle every detail from start to finish so you can just enjoy.'},
          ].map(w => (
            <div key={w.title} className="why-item">
              <div className="why-icon">{w.icon}</div>
              <div className="why-title">{w.title}</div>
              <p className="why-text">{w.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="lifestyle-section">
        <div style={{maxWidth:1200, margin:'0 auto'}}>
          <div className="section-eyebrow">Our Philosophy</div>
          <h2 className="section-title">Life Is Short.<br /><em>Travel More.</em></h2>
          <div className="divider" />
        </div>
        <div className="lifestyle-grid">
          <img src="/photos/lifestyle1.jpg" alt="Justin and Casondra Lamb" className="lifestyle-img" />
          <div className="lifestyle-text">
            <div className="quote">"The world is a book, and those who do not travel read only one page."</div>
            <p>We started The Roaming Lamb Travel Co. because we kept hearing the same thing from friends and family: "I want to travel more, I just don't know where to start."</p>
            <p>Planning a great trip takes dozens of hours of research, dozens of browser tabs, and a lot of second-guessing. We do all of that for you — drawing on our own real experiences to cut through the noise and find the experiences worth having.</p>
            <p>Whether it's your first trip abroad or your fiftieth, we'll make sure it's one you'll never forget.</p>
            <button className="btn-gold" style={{marginTop:24}} onClick={() => scrollTo('contact')}>Let's Plan Your Trip →</button>
          </div>
        </div>
      </section>

      <section id="contact" className="form-section">
        <div className="form-wrap">
          <div className="section-eyebrow">Get Started</div>
          <h2 className="section-title">Tell Us About<br /><em>Your Dream Trip</em></h2>
          <div className="divider" />
          <p>Fill out the form below and we'll reach out within 24 hours to start crafting your perfect itinerary. No commitment required — just a conversation.</p>
          {submitted ? (
            <div className="success-box">
              <div className="success-icon">✈️</div>
              <h3>We've Got Your Request!</h3>
              <p>Thank you, {form.first}! Justin & Casondra will be in touch within 24 hours to start planning your dream trip. Get excited — adventure is coming.</p>
            </div>
          ) : (
            <>
              <div className="form-grid">
                <div className="form-group"><label className="form-label">First Name *</label><input className="form-input" placeholder="Jane" value={form.first} onChange={e => setForm(f=>({...f,first:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Last Name *</label><input className="form-input" placeholder="Doe" value={form.last} onChange={e => setForm(f=>({...f,last:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Email *</label><input className="form-input" type="email" placeholder="jane@email.com" value={form.email} onChange={e => setForm(f=>({...f,email:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="(555) 000-0000" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Where Do You Want to Go?</label><input className="form-input" placeholder="Italy, Japan, Caribbean…" value={form.dest} onChange={e => setForm(f=>({...f,dest:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Trip Style</label>
                  <select className="form-select" value={form.style} onChange={e => setForm(f=>({...f,style:e.target.value}))}>
                    {['Leisure / Relaxation','Adventure / Active','Cultural / Historical','Foodie / Culinary','Honeymoon / Romance','Family','Group / Corporate'].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Departure Date</label><input className="form-input" type="date" value={form.depart} onChange={e => setForm(f=>({...f,depart:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Return Date</label><input className="form-input" type="date" value={form.ret} onChange={e => setForm(f=>({...f,ret:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Number of Travelers</label><input className="form-input" type="number" min="1" placeholder="2" value={form.travelers} onChange={e => setForm(f=>({...f,travelers:e.target.value}))} /></div>
                <div className="form-group"><label className="form-label">Budget (per person)</label><input className="form-input" placeholder="$5,000" value={form.budget} onChange={e => setForm(f=>({...f,budget:e.target.value}))} /></div>
                <div className="form-group full"><label className="form-label">Tell Us About Your Dream Trip</label><textarea className="form-textarea" placeholder="Dietary needs, must-see experiences, anniversaries, accessibility requirements…" value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} /></div>
              </div>
              <button className="submit-btn" onClick={handleSubmit} disabled={submitting}>{submitting ? 'Sending…' : 'Submit My Trip Request →'}</button>
            </>
          )}
        </div>
      </section>

      <footer>
        <div>
          <div className="footer-logo"><img src="/photos/logo-nav.png" alt="The Roaming Lamb Travel Co." /><div className="footer-logo-text">The Roaming <span>Lamb</span><br/>Travel Co.</div></div>
          <div className="footer-tagline">It's about Lamb time.</div>
        </div>
        <div className="footer-links">
          <a onClick={() => scrollTo('about')}>About</a>
          <a onClick={() => scrollTo('destinations')}>Destinations</a>
          <a onClick={() => scrollTo('contact')}>Contact</a>
        </div>
        <div className="footer-copy">© 2026 The Roaming Lamb Travel Co. All rights reserved.</div>
      </footer>
    </>
  );
}
