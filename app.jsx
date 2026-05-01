const { useState, useEffect, useRef, useCallback } = React;

const MENU = window.MENU_DATA;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#C9A961",
  "heroImage": "interior",
  "showSignatureStars": true,
  "menuLayout": "two-column"
}/*EDITMODE-END*/;

const HERO_IMAGES = {
  interior: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=2000&q=80',
  pasta: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=2000&q=80',
  table: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=2000&q=80',
  coast: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=2000&q=80',
};

function Logo({ color = 'currentColor' }) {
  return (
    <span className="nav-logo">
      <span>SUB</span>
      <span className="glyph" aria-hidden="true"></span>
      <span>GOURMET</span>
    </span>
  );
}

function Nav({ onReserve, scrolled, dark }) {
  const cls = ['nav'];
  if (scrolled) cls.push('scrolled');
  if (dark && !scrolled) cls.push('dark-bg');
  return (
    <nav className={cls.join(' ')}>
      <a href="#top" aria-label="Sub Gourmet"><Logo /></a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#menu">Menu</a>
        <a href="#gallery">Gallery</a>
        <a href="#visit">Visit</a>
      </div>
      <button className="nav-cta" onClick={onReserve}>Reserve</button>
      <button className="nav-burger" aria-label="Menu" onClick={() => {
        document.querySelector('#menu').scrollIntoView({behavior:'smooth'});
      }}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
}

function Hero({ onReserve, heroImage }) {
  return (
    <section className="hero" id="top">
      <div className="hero-bg" style={{ backgroundImage: `linear-gradient(120deg, rgba(20,18,16,0.78) 0%, rgba(20,18,16,0.45) 55%, rgba(20,18,16,0.78) 100%), url(${HERO_IMAGES[heroImage] || HERO_IMAGES.interior})` }}></div>
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow mono">
            <span className="line"></span>
            <span>Srebreno · Dubrovnik Riviera</span>
          </div>
          <h1>Sub<br/>Gourm<span className="amp">e</span>t</h1>
          <p className="hero-tag">Mediterranean flavors, Adriatic soul — where the coast meets the table, slowly, the way it should.</p>
          <div className="hero-ctas">
            <a href="#menu" className="btn btn-primary">View Menu <span className="arrow"></span></a>
            <button className="btn btn-ghost" onClick={onReserve}>Reserve a Table <span className="arrow"></span></button>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-label">Today</span>
              <span className="hero-meta-value"><span className="gold">●</span> Open until 9 PM</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">Reviewed</span>
              <span className="hero-meta-value"><span className="gold">★</span> 4.5 <span className="dot">·</span> 257 reviews</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">Per person</span>
              <span className="hero-meta-value">€10 – €15</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-corner mono">
        <span>Scroll</span>
        <span className="scroll-line"></span>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img reveal">
            <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80" alt="Outdoor terrace at Sub Gourmet" />
            <div className="stamp">
              <span className="small">Established</span>
              Since 2014
            </div>
          </div>
          <div className="reveal">
            <div className="section-head" style={{marginBottom: 32}}>
              <span className="eyebrow mono"><span className="line"></span><span>Our Story</span></span>
              <h2>A small kitchen with the <em>whole sea</em> beside it.</h2>
            </div>
            <div className="about-copy">
              <p className="lead">In Srebreno, a quiet bay just east of Dubrovnik, we cook the way our grandmothers did — and the way travelers wished they could.</p>
              <p>Our kitchen mixes the Dalmatian classics — grilled fish, slow-baked lamb, hand-rolled pasta with Istrian truffle — with the comfort dishes our guests have come to love over a long afternoon.</p>
              <p>The fish is from boats two minutes away. The olive oil from the hill behind us. The rest, we earn.</p>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="num">12</div>
                <div className="lbl">Years on the bay</div>
              </div>
              <div className="about-stat">
                <div className="num">94%</div>
                <div className="lbl">Locally sourced</div>
              </div>
              <div className="about-stat">
                <div className="num">4.5★</div>
                <div className="lbl">257 reviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({ showSignatureStars, layout }) {
  const [active, setActive] = useState('breakfast');
  const current = MENU.find(m => m.id === active);
  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>The Menu</span></span>
          <h2>Every plate tells a story <em>of the coast.</em></h2>
        </div>
        <div className="menu-tabs reveal">
          {MENU.map(m => (
            <button
              key={m.id}
              className={'menu-tab' + (active === m.id ? ' active' : '')}
              onClick={() => setActive(m.id)}
            >{m.en}</button>
          ))}
        </div>

        <div className="menu-section-meta reveal">
          <h3>{current.hr} <em>{current.en}</em></h3>
          <div className="hours">
            {current.hours ? <><span className="gold">Hours</span> · {current.hours}</> : current.note}
          </div>
        </div>

        <div className="menu-grid reveal" style={layout === 'one-column' ? {gridTemplateColumns: '1fr'} : {}}>
          {current.items.map((item, i) => (
            <div key={i} className={'menu-item' + (item.signature && showSignatureStars ? ' signature' : '')}>
              <div>
                <div className="menu-item-name">
                  {item.hr}
                  <span className="en">{item.en}</span>
                </div>
                {item.desc && <div className="menu-item-desc">{item.desc}</div>}
              </div>
              <div className="menu-item-price">€{item.price}</div>
            </div>
          ))}
        </div>

        <div className="menu-callout reveal">
          <div>
            <div className="serif">Allergies, dietary requests, <em>or a bottle from the cellar?</em></div>
            <p>Our team is happy to walk you through everything. Most pasta and risotto can be prepared gluten-free; vegetarian options are marked on request.</p>
          </div>
          <a href="#visit" className="btn btn-primary">Talk to us <span className="arrow"></span></a>
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const imgs = [
    { src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80', cls: 'big', alt: 'Sub Gourmet pizza' },
    { src: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=900&q=80', cls: 'tall', alt: 'Hand-rolled pasta' },
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80', cls: '', alt: 'Outdoor terrace at dusk' },
    { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=80', cls: '', alt: 'Restaurant interior' },
    { src: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=900&q=80', cls: 'wide', alt: 'House burger and fries' },
    { src: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=900&q=80', cls: 'tall', alt: 'Dubrovnik Riviera coastline' },
    { src: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=900&q=80', cls: '', alt: 'Grilled squid' },
    { src: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=80', cls: '', alt: 'Tiramisu dessert' },
    { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=900&q=80', cls: 'wide', alt: 'Grilled fish on plate' },
  ];
  return (
    <section className="gallery dark" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>The Room & The Plate</span></span>
          <h2>Where the <em>Adriatic</em> meets the table.</h2>
        </div>
        <div className="gallery-grid reveal">
          {imgs.map((img, i) => (
            <div key={i} className={'gallery-item ' + img.cls}>
              <img src={img.src} alt={img.alt} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visit() {
  return (
    <section className="visit" id="visit">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>Find Us</span></span>
          <h2>A short walk from the sea, <em>a long stay at the table.</em></h2>
        </div>
        <div className="visit-grid">
          <div className="visit-info reveal">
            <div className="visit-block">
              <span className="label">Address</span>
              <span className="value">Šetalište dr. Franje Tuđmana 2a<br/>20207 Srebreno, Croatia</span>
              <span className="value small">Located in K Centar Sub City</span>
            </div>
            <div className="visit-block">
              <span className="label">Hours</span>
              <span className="value">Open daily · until 9 PM</span>
              <span className="value small">Breakfast served 09:00 – 11:30</span>
            </div>
            <div className="visit-block">
              <span className="label">Reservations</span>
              <span className="value">+385 20 642 111</span>
            </div>
            <div className="visit-block">
              <span className="label">At the Table</span>
              <div className="visit-tags">
                <span className="visit-tag">Outdoor seating</span>
                <span className="visit-tag">Great cocktails</span>
                <span className="visit-tag">Vegetarian options</span>
                <span className="visit-tag">Walk-ins welcome</span>
              </div>
            </div>
            <div className="visit-block">
              <span className="label">Per Person</span>
              <span className="value">€10 – €15</span>
            </div>
          </div>

          <div className="visit-map reveal">
            <div className="map-canvas">
              <svg viewBox="0 0 600 600" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(245,240,232,0.1)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="600" height="600" fill="url(#grid)" />
                <path d="M 0 320 Q 150 280, 280 310 T 600 290 L 600 600 L 0 600 Z" fill="rgba(201,169,97,0.06)" stroke="rgba(201,169,97,0.4)" strokeWidth="1" />
                <path d="M 80 200 Q 200 180, 320 220 T 540 240" fill="none" stroke="rgba(245,240,232,0.15)" strokeWidth="1" />
                <path d="M 60 380 L 340 360 L 380 280 L 540 300" fill="none" stroke="rgba(245,240,232,0.18)" strokeWidth="1" strokeDasharray="3 4" />
              </svg>
              <div className="map-pin" aria-hidden="true"></div>
            </div>
            <div className="map-overlay-top">
              <div className="mono" style={{color: 'rgba(245,240,232,0.55)'}}>
                <span style={{color: 'var(--gold)'}}>●</span> Srebreno Bay
              </div>
              <div className="map-place">Just off the promenade,<br/><em>two minutes from the sea.</em></div>
            </div>
            <div className="map-overlay-bottom">
              <div>
                <div className="map-coords">K CENTAR · SUB CITY</div>
                <div className="map-coords" style={{marginTop: 6}}>SREBRENO · CROATIA</div>
              </div>
              <a href="https://maps.google.com/?q=Šetalište+dr.+Franje+Tuđmana+2a+Srebreno" target="_blank" rel="noreferrer" className="map-directions">
                Open in Maps <span style={{fontSize: 14}}>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="foot-top">
          <div>
            <div className="foot-brand">SUB · GOURMET</div>
            <p className="foot-tag">Mediterranean flavors, Adriatic soul. Open daily, sun to sunset, in Srebreno on the Dubrovnik Riviera.</p>
          </div>
          <div className="foot-col">
            <h5>Visit</h5>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#menu">Menu</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#visit">Find us</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Contact</h5>
            <ul>
              <li><a href="tel:+38520642111">+385 20 642 111</a></li>
              <li><a href="mailto:hello@subgourmet.hr">hello@subgourmet.hr</a></li>
              <li>Šetalište dr. Franje Tuđmana 2a</li>
              <li>20207 Srebreno, Croatia</li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>Follow</h5>
            <div className="foot-social">
              <a href="#" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9z"/></svg>
              </a>
            </div>
            <p style={{fontSize: 13, color: 'rgba(245,240,232,0.55)', marginTop: 14}}>@subcaffegourmet</p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 Sub Gourmet · Srebreno, Croatia</span>
          <span>Designed with care on the Adriatic</span>
        </div>
      </div>
    </footer>
  );
}

function ReservationModal({ open, onClose }) {
  const [step, setStep] = useState('form');
  const [data, setData] = useState({ name: '', phone: '', date: '', time: '19:00', guests: '2', notes: '' });

  useEffect(() => {
    if (!open) { setTimeout(() => setStep('form'), 400); }
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    setStep('done');
  };

  return (
    <div className={'modal-backdrop' + (open ? ' open' : '')} onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        {step === 'form' && (
          <>
            <h3>Reserve <em>your table</em></h3>
            <p className="modal-sub">Let us know when, and we'll have the bread warm and the wine ready.</p>
            <form className="modal-form" onSubmit={submit}>
              <label>Name
                <input type="text" required value={data.name} onChange={e => setData({...data, name: e.target.value})} placeholder="Your name" />
              </label>
              <label>Phone
                <input type="tel" required value={data.phone} onChange={e => setData({...data, phone: e.target.value})} placeholder="+385 ..." />
              </label>
              <label>Date
                <input type="date" required value={data.date} onChange={e => setData({...data, date: e.target.value})} />
              </label>
              <label>Time
                <select value={data.time} onChange={e => setData({...data, time: e.target.value})}>
                  {['12:00','13:00','14:00','18:00','18:30','19:00','19:30','20:00','20:30'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <label>Guests
                <select value={data.guests} onChange={e => setData({...data, guests: e.target.value})}>
                  {['1','2','3','4','5','6','7','8+'].map(t => <option key={t} value={t}>{t} {t==='1'?'guest':'guests'}</option>)}
                </select>
              </label>
              <label>Seating
                <select defaultValue="any">
                  <option value="any">No preference</option>
                  <option>Outdoor terrace</option>
                  <option>Indoor</option>
                </select>
              </label>
              <label className="full">Notes
                <textarea rows="2" value={data.notes} onChange={e => setData({...data, notes: e.target.value})} placeholder="Birthday, allergies, anything we should know..."></textarea>
              </label>
              <div className="modal-actions full">
                <button type="submit" className="btn btn-dark">Request table <span className="arrow"></span></button>
                <button type="button" className="modal-close" onClick={onClose}>Cancel</button>
              </div>
            </form>
          </>
        )}
        {step === 'done' && (
          <div className="modal-success">
            <div className="check">✓</div>
            <h3>Hvala — <em>see you soon.</em></h3>
            <p className="modal-sub" style={{marginTop: 12}}>We'll confirm your table for {data.guests} guests on {data.date || 'the requested date'} at {data.time} by phone shortly.</p>
            <div className="modal-actions" style={{justifyContent: 'center'}}>
              <button className="btn btn-dark" onClick={onClose}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
      // Determine if nav is over dark section (hero or gallery)
      const gallery = document.getElementById('gallery');
      const galleryRect = gallery ? gallery.getBoundingClientRect() : null;
      const overHero = y < window.innerHeight - 80;
      const overGallery = galleryRect && galleryRect.top < 60 && galleryRect.bottom > 60;
      setOverDark(overHero || overGallery);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });

  // Apply accent color
  useEffect(() => {
    document.documentElement.style.setProperty('--gold', tweaks.accentColor);
  }, [tweaks.accentColor]);

  return (
    <>
      <Nav onReserve={() => setModalOpen(true)} scrolled={scrolled} dark={overDark} />
      <Hero onReserve={() => setModalOpen(true)} heroImage={tweaks.heroImage} />
      <About />
      <MenuSection showSignatureStars={tweaks.showSignatureStars} layout={tweaks.menuLayout} />
      <Gallery />
      <Visit />
      <Footer />
      <ReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <TweaksPanel title="Tweaks">
        <TweakSection title="Hero">
          <TweakRadio
            label="Hero image"
            value={tweaks.heroImage}
            onChange={v => setTweak('heroImage', v)}
            options={[
              {value: 'interior', label: 'Interior'},
              {value: 'pasta', label: 'Pasta'},
              {value: 'table', label: 'Terrace'},
              {value: 'coast', label: 'Coast'},
            ]}
          />
        </TweakSection>
        <TweakSection title="Brand">
          <TweakColor label="Accent color" value={tweaks.accentColor} onChange={v => setTweak('accentColor', v)} />
        </TweakSection>
        <TweakSection title="Menu">
          <TweakToggle label="Highlight signature items" value={tweaks.showSignatureStars} onChange={v => setTweak('showSignatureStars', v)} />
          <TweakRadio
            label="Layout"
            value={tweaks.menuLayout}
            onChange={v => setTweak('menuLayout', v)}
            options={[
              {value: 'two-column', label: 'Two column'},
              {value: 'one-column', label: 'One column'},
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
