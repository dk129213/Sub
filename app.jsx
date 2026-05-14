const { useState, useEffect } = React;

const MENU = window.MENU_DATA;

const HERO_IMAGE = 'images/p1.jpg';
const ABOUT_IMAGE = 'images/p2.jpg';

// ─────────────── i18n ───────────────
const TRANSLATIONS = {
  en: {
    htmlLang: 'en',
    pageTitle: 'Sub Gourmet · Mediterranean flavors, Adriatic soul',
    nav: { about: 'About', menu: 'Menu', gallery: 'Gallery', visit: 'Visit', menuAria: 'Menu' },
    hero: {
      eyebrow: 'Srebreno · Dubrovnik Riviera',
      h1Top: 'Sub',
      h1Bot: ['Gourm', 'e', 't'],
      tag: 'Mediterranean flavors, Adriatic soul, where the coast meets the table, slowly, the way it should.',
      viewMenu: 'View Menu',
      today: 'Today',
      todayValue: 'Open until 9 PM',
      reviewed: 'Reviewed',
      reviewedValue: '257 reviews',
      perPerson: 'Per person',
      scroll: 'Scroll',
    },
    about: {
      eyebrow: 'Our Story',
      h2a: 'A small kitchen with the ',
      h2em: 'whole sea',
      h2b: ' beside it.',
      lead: 'In Srebreno, a quiet bay just east of Dubrovnik, we cook the way our grandmothers did, and the way travelers wished they could.',
      p1: 'Our kitchen mixes the Dalmatian classics (grilled fish, slow-baked lamb, hand-rolled pasta with Istrian truffle) with the comfort dishes our guests have come to love over a long afternoon.',
      p2: 'The fish is from boats two minutes away. The olive oil from the hill behind us. The rest, we earn.',
      stat1Num: '12', stat1Lbl: 'Years on the bay',
      stat2Num: '94%', stat2Lbl: 'Locally sourced',
      stat3Num: '4.5★', stat3Lbl: '257 reviews',
      stampEst: 'Established', stampSince: 'Since 2014',
      imgAlt: 'Outdoor terrace at Sub Gourmet',
    },
    menu: {
      eyebrow: 'The Menu',
      h2a: 'Every plate tells a story ',
      h2em: 'of the coast.',
      hoursLabel: 'Hours',
      calloutA: 'Allergies, dietary requests, ',
      calloutEm: 'or a bottle from the cellar?',
      calloutBody: 'Our team is happy to walk you through everything. Most pasta and risotto can be prepared gluten-free; vegetarian options are marked on request.',
      calloutCta: 'Talk to us',
    },
    gallery: {
      eyebrow: 'The Room & The Plate',
      h2a: 'Where the ',
      h2em: 'Adriatic',
      h2b: ' meets the table.',
    },
    visit: {
      eyebrow: 'Find Us',
      h2a: 'A short walk from the sea, ',
      h2em: 'a long stay at the table.',
      address: 'Address',
      addressLine1: 'Šetalište dr. Franje Tuđmana 2a',
      addressLine2: '20207 Srebreno, Croatia',
      addressLocated: 'Located in K Centar Sub City',
      hours: 'Hours',
      hoursValue: 'Open daily · until 9 PM',
      hoursSmall: 'Breakfast served 09:00 – 11:30',
      phone: 'Phone',
      atTable: 'At the Table',
      tagOutdoor: 'Outdoor seating',
      tagCocktails: 'Great cocktails',
      tagVegetarian: 'Vegetarian options',
      tagWalkIn: 'Walk-ins welcome',
      perPerson: 'Per Person',
      mapBay: 'Srebreno Bay',
      mapPlaceA: 'Just off the promenade,',
      mapPlaceEm: 'two minutes from the sea.',
      mapDirections: 'Open in Maps',
    },
    footer: {
      tag: 'Mediterranean flavors, Adriatic soul. Open daily, sun to sunset, in Srebreno on the Dubrovnik Riviera.',
      visit: 'Visit',
      lAbout: 'About', lMenu: 'Menu', lGallery: 'Gallery', lFindUs: 'Find us',
      contact: 'Contact',
      follow: 'Follow',
      copyright: '© 2026 Sub Gourmet · Srebreno, Croatia',
      designed: 'Designed with care on the Adriatic',
    },
  },
  hr: {
    htmlLang: 'hr',
    pageTitle: 'Sub Gourmet · Mediteranski okusi, jadranska duša',
    nav: { about: 'O nama', menu: 'Meni', gallery: 'Galerija', visit: 'Posjetite nas', menuAria: 'Meni' },
    hero: {
      eyebrow: 'Srebreno · Dubrovačka rivijera',
      h1Top: 'Sub',
      h1Bot: ['Gourm', 'e', 't'],
      tag: 'Mediteranski okusi, jadranska duša, gdje se obala susreće sa stolom, polako, onako kako treba.',
      viewMenu: 'Pogledajte meni',
      today: 'Danas',
      todayValue: 'Otvoreno do 21h',
      reviewed: 'Ocjenjeno',
      reviewedValue: '257 recenzija',
      perPerson: 'Po osobi',
      scroll: 'Pomakni',
    },
    about: {
      eyebrow: 'Naša priča',
      h2a: 'Mala kuhinja s ',
      h2em: 'cijelim morem',
      h2b: ' pored sebe.',
      lead: 'U Srebrenom, tihoj uvali istočno od Dubrovnika, kuhamo kao što su naše bake, i kako su putnici poželjeli da znaju.',
      p1: 'U našoj kuhinji se miješaju dalmatinski klasici (riba s roštilja, polagano pečena janjetina, ručno valjana tjestenina s istarskim tartufom) s domaćim jelima koja naši gosti vole uz dugo popodne.',
      p2: 'Riba je s brodova dvije minute odavde. Maslinovo ulje s brda iza nas. Ostalo zaslužujemo.',
      stat1Num: '12', stat1Lbl: 'Godina u uvali',
      stat2Num: '94%', stat2Lbl: 'Lokalnog porijekla',
      stat3Num: '4.5★', stat3Lbl: '257 recenzija',
      stampEst: 'Osnovano', stampSince: 'Od 2014.',
      imgAlt: 'Vanjska terasa Sub Gourmeta',
    },
    menu: {
      eyebrow: 'Meni',
      h2a: 'Svaki tanjur priča priču ',
      h2em: 'o obali.',
      hoursLabel: 'Radno vrijeme',
      calloutA: 'Alergije, posebne želje, ',
      calloutEm: 'ili boca iz vinarije?',
      calloutBody: 'Naš tim će vas rado provesti kroz sve. Većina tjestenina i rižota može se pripremiti bez glutena; vegetarijanske opcije dostupne su na upit.',
      calloutCta: 'Razgovarajte s nama',
    },
    gallery: {
      eyebrow: 'Prostor i tanjur',
      h2a: 'Gdje se ',
      h2em: 'Jadran',
      h2b: ' susreće sa stolom.',
    },
    visit: {
      eyebrow: 'Pronađite nas',
      h2a: 'Kratko od mora, ',
      h2em: 'dugo za stolom.',
      address: 'Adresa',
      addressLine1: 'Šetalište dr. Franje Tuđmana 2a',
      addressLine2: '20207 Srebreno, Hrvatska',
      addressLocated: 'U K Centru Sub City',
      hours: 'Radno vrijeme',
      hoursValue: 'Otvoreno svaki dan · do 21h',
      hoursSmall: 'Doručak posluženo 09:00 – 11:30',
      phone: 'Telefon',
      atTable: 'Za stolom',
      tagOutdoor: 'Vanjska terasa',
      tagCocktails: 'Odlični kokteli',
      tagVegetarian: 'Vegetarijanske opcije',
      tagWalkIn: 'Dobrodošli i bez rezervacije',
      perPerson: 'Po osobi',
      mapBay: 'Uvala Srebreno',
      mapPlaceA: 'Tik uz šetnicu,',
      mapPlaceEm: 'dvije minute od mora.',
      mapDirections: 'Otvori u kartama',
    },
    footer: {
      tag: 'Mediteranski okusi, jadranska duša. Otvoreno svaki dan, od sunca do zalaska, u Srebrenom na Dubrovačkoj rivijeri.',
      visit: 'Posjetite',
      lAbout: 'O nama', lMenu: 'Meni', lGallery: 'Galerija', lFindUs: 'Pronađite nas',
      contact: 'Kontakt',
      follow: 'Pratite nas',
      copyright: '© 2026 Sub Gourmet · Srebreno, Hrvatska',
      designed: 'Stvoreno s ljubavlju na Jadranu',
    },
  },
};

function useLang() {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem('subgourmet-lang');
      if (stored === 'en' || stored === 'hr') return stored;
      const browser = (navigator.language || '').toLowerCase();
      return browser.startsWith('hr') ? 'hr' : 'en';
    } catch (e) { return 'en'; }
  });
  const setLang = (l) => {
    setLangState(l);
    try { localStorage.setItem('subgourmet-lang', l); } catch (e) {}
  };
  useEffect(() => {
    document.documentElement.setAttribute('lang', TRANSLATIONS[lang].htmlLang);
    document.title = TRANSLATIONS[lang].pageTitle;
  }, [lang]);
  return [lang, setLang];
}

function Logo() {
  return (
    <span className="nav-logo">
      <span>SUB</span>
      <span className="glyph" aria-hidden="true"></span>
      <span>GOURMET</span>
    </span>
  );
}

function LangToggle({ lang, setLang }) {
  return (
    <div className="lang-toggle" role="group" aria-label="Language">
      <button
        type="button"
        className={'lang-btn' + (lang === 'en' ? ' active' : '')}
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
      >EN</button>
      <span className="lang-sep" aria-hidden="true">·</span>
      <button
        type="button"
        className={'lang-btn' + (lang === 'hr' ? ' active' : '')}
        onClick={() => setLang('hr')}
        aria-pressed={lang === 'hr'}
      >HR</button>
    </div>
  );
}

function Nav({ scrolled, dark, lang, setLang, t }) {
  const cls = ['nav'];
  if (scrolled) cls.push('scrolled');
  if (dark && !scrolled) cls.push('dark-bg');
  return (
    <nav className={cls.join(' ')}>
      <a href="#top" aria-label="Sub Gourmet"><Logo /></a>
      <div className="nav-links">
        <a href="#about">{t.nav.about}</a>
        <a href="#menu">{t.nav.menu}</a>
        <a href="#gallery">{t.nav.gallery}</a>
        <a href="#visit">{t.nav.visit}</a>
      </div>
      <div className="nav-right">
        <LangToggle lang={lang} setLang={setLang} />
      </div>
      <button className="nav-burger" aria-label={t.nav.menuAria} onClick={() => {
        document.querySelector('#menu').scrollIntoView({behavior:'smooth'});
      }}>
        <span></span><span></span><span></span>
      </button>
    </nav>
  );
}

function Hero({ t }) {
  const [a, b, c] = t.hero.h1Bot;
  return (
    <section className="hero" id="top">
      <div className="hero-bg" style={{ backgroundImage: `linear-gradient(120deg, rgba(20,18,16,0.78) 0%, rgba(20,18,16,0.45) 55%, rgba(20,18,16,0.78) 100%), url(${HERO_IMAGE})` }}></div>
      <div className="hero-inner">
        <div>
          <div className="hero-eyebrow mono">
            <span className="line"></span>
            <span>{t.hero.eyebrow}</span>
          </div>
          <h1>{t.hero.h1Top}<br/>{a}<span className="amp">{b}</span>{c}</h1>
          <p className="hero-tag">{t.hero.tag}</p>
          <div className="hero-ctas">
            <a href="#menu" className="btn btn-primary">{t.hero.viewMenu} <span className="arrow"></span></a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <span className="hero-meta-label">{t.hero.today}</span>
              <span className="hero-meta-value"><span className="gold">●</span> {t.hero.todayValue}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">{t.hero.reviewed}</span>
              <span className="hero-meta-value"><span className="gold">★</span> 4.5 <span className="dot">·</span> {t.hero.reviewedValue}</span>
            </div>
            <div className="hero-meta-item">
              <span className="hero-meta-label">{t.hero.perPerson}</span>
              <span className="hero-meta-value">€10 – €15</span>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-corner mono">
        <span>{t.hero.scroll}</span>
        <span className="scroll-line"></span>
      </div>
    </section>
  );
}

function About({ t }) {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-img reveal">
            <img src={ABOUT_IMAGE} alt={t.about.imgAlt} loading="lazy" decoding="async" />
            <div className="stamp">
              <span className="small">{t.about.stampEst}</span>
              {t.about.stampSince}
            </div>
          </div>
          <div className="reveal">
            <div className="section-head" style={{marginBottom: 32}}>
              <span className="eyebrow mono"><span className="line"></span><span>{t.about.eyebrow}</span></span>
              <h2>{t.about.h2a}<em>{t.about.h2em}</em>{t.about.h2b}</h2>
            </div>
            <div className="about-copy">
              <p className="lead">{t.about.lead}</p>
              <p>{t.about.p1}</p>
              <p>{t.about.p2}</p>
            </div>
            <div className="about-stats">
              <div className="about-stat">
                <div className="num">{t.about.stat1Num}</div>
                <div className="lbl">{t.about.stat1Lbl}</div>
              </div>
              <div className="about-stat">
                <div className="num">{t.about.stat2Num}</div>
                <div className="lbl">{t.about.stat2Lbl}</div>
              </div>
              <div className="about-stat">
                <div className="num">{t.about.stat3Num}</div>
                <div className="lbl">{t.about.stat3Lbl}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MenuSection({ lang, t }) {
  const [active, setActive] = useState('breakfast');
  const current = MENU.find(m => m.id === active);
  const primaryLang = lang === 'hr' ? 'hr' : 'en';
  const itemDesc = (item) => lang === 'hr' ? (item.descHr || item.desc) : item.desc;
  const sectionNote = (m) => lang === 'hr' ? (m.noteHr || m.note) : m.note;
  const sectionHours = (m) => lang === 'hr' ? (m.hoursHr || m.hours) : m.hours;
  return (
    <section className="menu" id="menu">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>{t.menu.eyebrow}</span></span>
          <h2>{t.menu.h2a}<em>{t.menu.h2em}</em></h2>
        </div>
        <div className="menu-tabs reveal">
          {MENU.map(m => (
            <button
              key={m.id}
              className={'menu-tab' + (active === m.id ? ' active' : '')}
              onClick={() => setActive(m.id)}
            >{m[primaryLang]}</button>
          ))}
        </div>

        <div className="menu-section-meta reveal">
          <h3>{current[primaryLang]}</h3>
          <div className="hours">
            {current.hours ? <><span className="gold">{t.menu.hoursLabel}</span> · {sectionHours(current)}</> : sectionNote(current)}
          </div>
        </div>

        <div className="menu-grid reveal">
          {current.items.map((item, i) => (
            <div key={i} className={'menu-item' + (item.signature ? ' signature' : '')}>
              <div>
                <div className="menu-item-name">
                  {item[primaryLang]}
                </div>
                {item.desc && <div className="menu-item-desc">{itemDesc(item)}</div>}
              </div>
              <div className="menu-item-price">€{item.price}</div>
            </div>
          ))}
        </div>

        <div className="menu-callout reveal">
          <div>
            <div className="serif">{t.menu.calloutA}<em>{t.menu.calloutEm}</em></div>
            <p>{t.menu.calloutBody}</p>
          </div>
          <a href="#visit" className="btn btn-primary">{t.menu.calloutCta} <span className="arrow"></span></a>
        </div>
      </div>
    </section>
  );
}

const GALLERY = [
  { src: 'images/p3.jpg', cls: 'big',  alt: 'Sub Gourmet interior' },
  { src: 'images/f5.jpg', cls: 'tall', alt: 'House plate' },
  { src: 'images/f3.jpg', cls: '',     alt: 'House plate' },
  { src: 'images/f9.jpg', cls: '',     alt: 'House plate' },
  { src: 'images/f10.jpg', cls: 'wide', alt: 'House plate' },
  { src: 'images/f15.jpg', cls: 'tall', alt: 'House plate' },
  { src: 'images/f8.jpg', cls: '',     alt: 'House plate' },
  { src: 'images/f4.jpg', cls: '',     alt: 'House plate' },
  { src: 'images/f17.jpg', cls: 'wide', alt: 'House plate' },
];

function Gallery({ t }) {
  return (
    <section className="gallery dark" id="gallery">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>{t.gallery.eyebrow}</span></span>
          <h2>{t.gallery.h2a}<em>{t.gallery.h2em}</em>{t.gallery.h2b}</h2>
        </div>
        <div className="gallery-grid reveal">
          {GALLERY.map((img, i) => (
            <div key={i} className={'gallery-item ' + img.cls}>
              <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Visit({ t }) {
  return (
    <section className="visit" id="visit">
      <div className="container">
        <div className="section-head reveal">
          <span className="eyebrow mono"><span className="line"></span><span>{t.visit.eyebrow}</span></span>
          <h2>{t.visit.h2a}<em>{t.visit.h2em}</em></h2>
        </div>
        <div className="visit-grid">
          <div className="visit-info reveal">
            <div className="visit-block">
              <span className="label">{t.visit.address}</span>
              <span className="value">{t.visit.addressLine1}<br/>{t.visit.addressLine2}</span>
              <span className="value small">{t.visit.addressLocated}</span>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.hours}</span>
              <span className="value">{t.visit.hoursValue}</span>
              <span className="value small">{t.visit.hoursSmall}</span>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.phone}</span>
              <span className="value">+385 20 642 111</span>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.atTable}</span>
              <div className="visit-tags">
                <span className="visit-tag">{t.visit.tagOutdoor}</span>
                <span className="visit-tag">{t.visit.tagCocktails}</span>
                <span className="visit-tag">{t.visit.tagVegetarian}</span>
                <span className="visit-tag">{t.visit.tagWalkIn}</span>
              </div>
            </div>
            <div className="visit-block">
              <span className="label">{t.visit.perPerson}</span>
              <span className="value">€10 – €15</span>
            </div>
          </div>

          <div className="visit-map reveal">
            <div className="map-canvas">
              <svg viewBox="0 0 600 600" preserveAspectRatio="none" aria-hidden="true">
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
                <span style={{color: 'var(--gold)'}}>●</span> {t.visit.mapBay}
              </div>
              <div className="map-place">{t.visit.mapPlaceA}<br/><em>{t.visit.mapPlaceEm}</em></div>
            </div>
            <div className="map-overlay-bottom">
              <div>
                <div className="map-coords">K CENTAR · SUB CITY</div>
                <div className="map-coords" style={{marginTop: 6}}>SREBRENO · {t.htmlLang === 'hr' ? 'HRVATSKA' : 'CROATIA'}</div>
              </div>
              <a href="https://maps.google.com/?q=Šetalište+dr.+Franje+Tuđmana+2a+Srebreno" target="_blank" rel="noreferrer" className="map-directions">
                {t.visit.mapDirections} <span style={{fontSize: 14}}>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ t }) {
  return (
    <footer>
      <div className="container">
        <div className="foot-top">
          <div>
            <div className="foot-brand">SUB · GOURMET</div>
            <p className="foot-tag">{t.footer.tag}</p>
          </div>
          <div className="foot-col">
            <h5>{t.footer.visit}</h5>
            <ul>
              <li><a href="#about">{t.footer.lAbout}</a></li>
              <li><a href="#menu">{t.footer.lMenu}</a></li>
              <li><a href="#gallery">{t.footer.lGallery}</a></li>
              <li><a href="#visit">{t.footer.lFindUs}</a></li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>{t.footer.contact}</h5>
            <ul>
              <li><a href="tel:+38520642111">+385 20 642 111</a></li>
              <li><a href="mailto:hello@subgourmet.hr">hello@subgourmet.hr</a></li>
              <li>Šetalište dr. Franje Tuđmana 2a</li>
              <li>20207 Srebreno, {t.htmlLang === 'hr' ? 'Hrvatska' : 'Croatia'}</li>
            </ul>
          </div>
          <div className="foot-col">
            <h5>{t.footer.follow}</h5>
            <div className="foot-social">
              <a href="#" aria-label="Instagram">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.7" fill="currentColor"/></svg>
              </a>
              <a href="#" aria-label="Facebook">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M14 9h3V6h-3a3 3 0 0 0-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9z"/></svg>
              </a>
            </div>
            <p style={{fontSize: 13, color: 'rgba(245,240,232,0.55)', marginTop: 14}}>@subcaffegourmet</p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>{t.footer.copyright}</span>
          <span>{t.footer.designed}</span>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [lang, setLang] = useLang();
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 80);
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

  return (
    <>
      <Nav scrolled={scrolled} dark={overDark} lang={lang} setLang={setLang} t={t} />
      <Hero t={t} />
      <About t={t} />
      <MenuSection lang={lang} t={t} />
      <Gallery t={t} />
      <Visit t={t} />
      <Footer t={t} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
