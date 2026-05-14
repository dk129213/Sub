const {
  useState,
  useEffect
} = React;
const MENU = window.MENU_DATA;
const HERO_IMAGE = 'images/p1.jpg';
const ABOUT_IMAGE = 'images/p2.jpg';

// ─────────────── i18n ───────────────
const TRANSLATIONS = {
  en: {
    htmlLang: 'en',
    pageTitle: 'Sub Gourmet · Mediterranean flavors, Adriatic soul',
    nav: {
      about: 'About',
      menu: 'Menu',
      gallery: 'Gallery',
      visit: 'Visit',
      menuAria: 'Menu'
    },
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
      scroll: 'Scroll'
    },
    about: {
      eyebrow: 'Our Story',
      h2a: 'A small kitchen with the ',
      h2em: 'whole sea',
      h2b: ' beside it.',
      lead: 'In Srebreno, a quiet bay just east of Dubrovnik, we cook the way our grandmothers did, and the way travelers wished they could.',
      p1: 'Our kitchen mixes the Dalmatian classics (grilled fish, slow-baked lamb, hand-rolled pasta with Istrian truffle) with the comfort dishes our guests have come to love over a long afternoon.',
      p2: 'The fish is from boats two minutes away. The olive oil from the hill behind us. The rest, we earn.',
      stat1Num: '12',
      stat1Lbl: 'Years on the bay',
      stat2Num: '94%',
      stat2Lbl: 'Locally sourced',
      stat3Num: '4.5★',
      stat3Lbl: '257 reviews',
      stampEst: 'Established',
      stampSince: 'Since 2014',
      imgAlt: 'Outdoor terrace at Sub Gourmet'
    },
    menu: {
      eyebrow: 'The Menu',
      h2a: 'Every plate tells a story ',
      h2em: 'of the coast.',
      hoursLabel: 'Hours',
      calloutA: 'Allergies, dietary requests, ',
      calloutEm: 'or a bottle from the cellar?',
      calloutBody: 'Our team is happy to walk you through everything. Most pasta and risotto can be prepared gluten-free; vegetarian options are marked on request.',
      calloutCta: 'Talk to us'
    },
    gallery: {
      eyebrow: 'The Room & The Plate',
      h2a: 'Where the ',
      h2em: 'Adriatic',
      h2b: ' meets the table.'
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
      mapDirections: 'Open in Maps'
    },
    footer: {
      tag: 'Mediterranean flavors, Adriatic soul. Open daily, sun to sunset, in Srebreno on the Dubrovnik Riviera.',
      visit: 'Visit',
      lAbout: 'About',
      lMenu: 'Menu',
      lGallery: 'Gallery',
      lFindUs: 'Find us',
      contact: 'Contact',
      follow: 'Follow',
      copyright: '© 2026 Sub Gourmet · Srebreno, Croatia',
      designed: 'Designed with care on the Adriatic'
    }
  },
  hr: {
    htmlLang: 'hr',
    pageTitle: 'Sub Gourmet · Mediteranski okusi, jadranska duša',
    nav: {
      about: 'O nama',
      menu: 'Meni',
      gallery: 'Galerija',
      visit: 'Posjetite nas',
      menuAria: 'Meni'
    },
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
      scroll: 'Pomakni'
    },
    about: {
      eyebrow: 'Naša priča',
      h2a: 'Mala kuhinja s ',
      h2em: 'cijelim morem',
      h2b: ' pored sebe.',
      lead: 'U Srebrenom, tihoj uvali istočno od Dubrovnika, kuhamo kao što su naše bake, i kako su putnici poželjeli da znaju.',
      p1: 'U našoj kuhinji se miješaju dalmatinski klasici (riba s roštilja, polagano pečena janjetina, ručno valjana tjestenina s istarskim tartufom) s domaćim jelima koja naši gosti vole uz dugo popodne.',
      p2: 'Riba je s brodova dvije minute odavde. Maslinovo ulje s brda iza nas. Ostalo zaslužujemo.',
      stat1Num: '12',
      stat1Lbl: 'Godina u uvali',
      stat2Num: '94%',
      stat2Lbl: 'Lokalnog porijekla',
      stat3Num: '4.5★',
      stat3Lbl: '257 recenzija',
      stampEst: 'Osnovano',
      stampSince: 'Od 2014.',
      imgAlt: 'Vanjska terasa Sub Gourmeta'
    },
    menu: {
      eyebrow: 'Meni',
      h2a: 'Svaki tanjur priča priču ',
      h2em: 'o obali.',
      hoursLabel: 'Radno vrijeme',
      calloutA: 'Alergije, posebne želje, ',
      calloutEm: 'ili boca iz vinarije?',
      calloutBody: 'Naš tim će vas rado provesti kroz sve. Većina tjestenina i rižota može se pripremiti bez glutena; vegetarijanske opcije dostupne su na upit.',
      calloutCta: 'Razgovarajte s nama'
    },
    gallery: {
      eyebrow: 'Prostor i tanjur',
      h2a: 'Gdje se ',
      h2em: 'Jadran',
      h2b: ' susreće sa stolom.'
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
      mapDirections: 'Otvori u kartama'
    },
    footer: {
      tag: 'Mediteranski okusi, jadranska duša. Otvoreno svaki dan, od sunca do zalaska, u Srebrenom na Dubrovačkoj rivijeri.',
      visit: 'Posjetite',
      lAbout: 'O nama',
      lMenu: 'Meni',
      lGallery: 'Galerija',
      lFindUs: 'Pronađite nas',
      contact: 'Kontakt',
      follow: 'Pratite nas',
      copyright: '© 2026 Sub Gourmet · Srebreno, Hrvatska',
      designed: 'Stvoreno s ljubavlju na Jadranu'
    }
  }
};
function useLang() {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem('subgourmet-lang');
      if (stored === 'en' || stored === 'hr') return stored;
      const browser = (navigator.language || '').toLowerCase();
      return browser.startsWith('hr') ? 'hr' : 'en';
    } catch (e) {
      return 'en';
    }
  });
  const setLang = l => {
    setLangState(l);
    try {
      localStorage.setItem('subgourmet-lang', l);
    } catch (e) {}
  };
  useEffect(() => {
    document.documentElement.setAttribute('lang', TRANSLATIONS[lang].htmlLang);
    document.title = TRANSLATIONS[lang].pageTitle;
  }, [lang]);
  return [lang, setLang];
}
function Logo() {
  return /*#__PURE__*/React.createElement("span", {
    className: "nav-logo"
  }, /*#__PURE__*/React.createElement("span", null, "SUB"), /*#__PURE__*/React.createElement("span", {
    className: "glyph",
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", null, "GOURMET"));
}
function LangToggle({
  lang,
  setLang
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "lang-toggle",
    role: "group",
    "aria-label": "Language"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: 'lang-btn' + (lang === 'en' ? ' active' : ''),
    onClick: () => setLang('en'),
    "aria-pressed": lang === 'en'
  }, "EN"), /*#__PURE__*/React.createElement("span", {
    className: "lang-sep",
    "aria-hidden": "true"
  }, "\xB7"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: 'lang-btn' + (lang === 'hr' ? ' active' : ''),
    onClick: () => setLang('hr'),
    "aria-pressed": lang === 'hr'
  }, "HR"));
}
function Nav({
  scrolled,
  dark,
  lang,
  setLang,
  t
}) {
  const cls = ['nav'];
  if (scrolled) cls.push('scrolled');
  if (dark && !scrolled) cls.push('dark-bg');
  return /*#__PURE__*/React.createElement("nav", {
    className: cls.join(' ')
  }, /*#__PURE__*/React.createElement("a", {
    href: "#top",
    "aria-label": "Sub Gourmet"
  }, /*#__PURE__*/React.createElement(Logo, null)), /*#__PURE__*/React.createElement("div", {
    className: "nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#about"
  }, t.nav.about), /*#__PURE__*/React.createElement("a", {
    href: "#menu"
  }, t.nav.menu), /*#__PURE__*/React.createElement("a", {
    href: "#gallery"
  }, t.nav.gallery), /*#__PURE__*/React.createElement("a", {
    href: "#visit"
  }, t.nav.visit)), /*#__PURE__*/React.createElement("div", {
    className: "nav-right"
  }, /*#__PURE__*/React.createElement(LangToggle, {
    lang: lang,
    setLang: setLang
  })), /*#__PURE__*/React.createElement("button", {
    className: "nav-burger",
    "aria-label": t.nav.menuAria,
    onClick: () => {
      document.querySelector('#menu').scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null), /*#__PURE__*/React.createElement("span", null)));
}
function Hero({
  t
}) {
  const [a, b, c] = t.hero.h1Bot;
  return /*#__PURE__*/React.createElement("section", {
    className: "hero",
    id: "top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-bg",
    style: {
      backgroundImage: `linear-gradient(120deg, rgba(20,18,16,0.78) 0%, rgba(20,18,16,0.45) 55%, rgba(20,18,16,0.78) 100%), url(${HERO_IMAGE})`
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "hero-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hero-eyebrow mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line"
  }), /*#__PURE__*/React.createElement("span", null, t.hero.eyebrow)), /*#__PURE__*/React.createElement("h1", null, t.hero.h1Top, /*#__PURE__*/React.createElement("br", null), a, /*#__PURE__*/React.createElement("span", {
    className: "amp"
  }, b), c), /*#__PURE__*/React.createElement("p", {
    className: "hero-tag"
  }, t.hero.tag), /*#__PURE__*/React.createElement("div", {
    className: "hero-ctas"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#menu",
    className: "btn btn-primary"
  }, t.hero.viewMenu, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "hero-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-meta-label"
  }, t.hero.today), /*#__PURE__*/React.createElement("span", {
    className: "hero-meta-value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gold"
  }, "\u25CF"), " ", t.hero.todayValue)), /*#__PURE__*/React.createElement("div", {
    className: "hero-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-meta-label"
  }, t.hero.reviewed), /*#__PURE__*/React.createElement("span", {
    className: "hero-meta-value"
  }, /*#__PURE__*/React.createElement("span", {
    className: "gold"
  }, "\u2605"), " 4.5 ", /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }, "\xB7"), " ", t.hero.reviewedValue)), /*#__PURE__*/React.createElement("div", {
    className: "hero-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hero-meta-label"
  }, t.hero.perPerson), /*#__PURE__*/React.createElement("span", {
    className: "hero-meta-value"
  }, "\u20AC10 \u2013 \u20AC15"))))), /*#__PURE__*/React.createElement("div", {
    className: "hero-corner mono"
  }, /*#__PURE__*/React.createElement("span", null, t.hero.scroll), /*#__PURE__*/React.createElement("span", {
    className: "scroll-line"
  })));
}
function About({
  t
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "about",
    id: "about"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-img reveal"
  }, /*#__PURE__*/React.createElement("img", {
    src: ABOUT_IMAGE,
    alt: t.about.imgAlt,
    loading: "lazy",
    decoding: "async"
  }), /*#__PURE__*/React.createElement("div", {
    className: "stamp"
  }, /*#__PURE__*/React.createElement("span", {
    className: "small"
  }, t.about.stampEst), t.about.stampSince)), /*#__PURE__*/React.createElement("div", {
    className: "reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head",
    style: {
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line"
  }), /*#__PURE__*/React.createElement("span", null, t.about.eyebrow)), /*#__PURE__*/React.createElement("h2", null, t.about.h2a, /*#__PURE__*/React.createElement("em", null, t.about.h2em), t.about.h2b)), /*#__PURE__*/React.createElement("div", {
    className: "about-copy"
  }, /*#__PURE__*/React.createElement("p", {
    className: "lead"
  }, t.about.lead), /*#__PURE__*/React.createElement("p", null, t.about.p1), /*#__PURE__*/React.createElement("p", null, t.about.p2)), /*#__PURE__*/React.createElement("div", {
    className: "about-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "about-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, t.about.stat1Num), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, t.about.stat1Lbl)), /*#__PURE__*/React.createElement("div", {
    className: "about-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, t.about.stat2Num), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, t.about.stat2Lbl)), /*#__PURE__*/React.createElement("div", {
    className: "about-stat"
  }, /*#__PURE__*/React.createElement("div", {
    className: "num"
  }, t.about.stat3Num), /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, t.about.stat3Lbl)))))));
}
function MenuSection({
  lang,
  t
}) {
  const [active, setActive] = useState('breakfast');
  const current = MENU.find(m => m.id === active);
  const primaryLang = lang === 'hr' ? 'hr' : 'en';
  const itemDesc = item => lang === 'hr' ? item.descHr || item.desc : item.desc;
  const sectionNote = m => lang === 'hr' ? m.noteHr || m.note : m.note;
  const sectionHours = m => lang === 'hr' ? m.hoursHr || m.hours : m.hours;
  return /*#__PURE__*/React.createElement("section", {
    className: "menu",
    id: "menu"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line"
  }), /*#__PURE__*/React.createElement("span", null, t.menu.eyebrow)), /*#__PURE__*/React.createElement("h2", null, t.menu.h2a, /*#__PURE__*/React.createElement("em", null, t.menu.h2em))), /*#__PURE__*/React.createElement("div", {
    className: "menu-tabs reveal"
  }, MENU.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    className: 'menu-tab' + (active === m.id ? ' active' : ''),
    onClick: () => setActive(m.id)
  }, m[primaryLang]))), /*#__PURE__*/React.createElement("div", {
    className: "menu-section-meta reveal"
  }, /*#__PURE__*/React.createElement("h3", null, current[primaryLang]), /*#__PURE__*/React.createElement("div", {
    className: "hours"
  }, current.hours ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
    className: "gold"
  }, t.menu.hoursLabel), " \xB7 ", sectionHours(current)) : sectionNote(current))), /*#__PURE__*/React.createElement("div", {
    className: "menu-grid reveal"
  }, current.items.map((item, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'menu-item' + (item.signature ? ' signature' : '')
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "menu-item-name"
  }, item[primaryLang]), item.desc && /*#__PURE__*/React.createElement("div", {
    className: "menu-item-desc"
  }, itemDesc(item))), /*#__PURE__*/React.createElement("div", {
    className: "menu-item-price"
  }, "\u20AC", item.price)))), /*#__PURE__*/React.createElement("div", {
    className: "menu-callout reveal"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "serif"
  }, t.menu.calloutA, /*#__PURE__*/React.createElement("em", null, t.menu.calloutEm)), /*#__PURE__*/React.createElement("p", null, t.menu.calloutBody)), /*#__PURE__*/React.createElement("a", {
    href: "#visit",
    className: "btn btn-primary"
  }, t.menu.calloutCta, " ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  })))));
}
const GALLERY = [{
  src: 'images/p3.jpg',
  cls: 'big',
  alt: 'Sub Gourmet interior'
}, {
  src: 'images/f5.jpg',
  cls: 'tall',
  alt: 'House plate'
}, {
  src: 'images/f3.jpg',
  cls: '',
  alt: 'House plate'
}, {
  src: 'images/f9.jpg',
  cls: '',
  alt: 'House plate'
}, {
  src: 'images/f10.jpg',
  cls: 'wide',
  alt: 'House plate'
}, {
  src: 'images/f15.jpg',
  cls: 'tall',
  alt: 'House plate'
}, {
  src: 'images/f8.jpg',
  cls: '',
  alt: 'House plate'
}, {
  src: 'images/f4.jpg',
  cls: '',
  alt: 'House plate'
}, {
  src: 'images/f17.jpg',
  cls: 'wide',
  alt: 'House plate'
}];
function Gallery({
  t
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "gallery dark",
    id: "gallery"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line"
  }), /*#__PURE__*/React.createElement("span", null, t.gallery.eyebrow)), /*#__PURE__*/React.createElement("h2", null, t.gallery.h2a, /*#__PURE__*/React.createElement("em", null, t.gallery.h2em), t.gallery.h2b)), /*#__PURE__*/React.createElement("div", {
    className: "gallery-grid reveal"
  }, GALLERY.map((img, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: 'gallery-item ' + img.cls
  }, /*#__PURE__*/React.createElement("img", {
    src: img.src,
    alt: img.alt,
    loading: "lazy",
    decoding: "async"
  }))))));
}
function Visit({
  t
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "visit",
    id: "visit"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-head reveal"
  }, /*#__PURE__*/React.createElement("span", {
    className: "eyebrow mono"
  }, /*#__PURE__*/React.createElement("span", {
    className: "line"
  }), /*#__PURE__*/React.createElement("span", null, t.visit.eyebrow)), /*#__PURE__*/React.createElement("h2", null, t.visit.h2a, /*#__PURE__*/React.createElement("em", null, t.visit.h2em))), /*#__PURE__*/React.createElement("div", {
    className: "visit-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "visit-info reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "visit-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, t.visit.address), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, t.visit.addressLine1, /*#__PURE__*/React.createElement("br", null), t.visit.addressLine2), /*#__PURE__*/React.createElement("span", {
    className: "value small"
  }, t.visit.addressLocated)), /*#__PURE__*/React.createElement("div", {
    className: "visit-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, t.visit.hours), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, t.visit.hoursValue), /*#__PURE__*/React.createElement("span", {
    className: "value small"
  }, t.visit.hoursSmall)), /*#__PURE__*/React.createElement("div", {
    className: "visit-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, t.visit.phone), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, "+385 20 642 111")), /*#__PURE__*/React.createElement("div", {
    className: "visit-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, t.visit.atTable), /*#__PURE__*/React.createElement("div", {
    className: "visit-tags"
  }, /*#__PURE__*/React.createElement("span", {
    className: "visit-tag"
  }, t.visit.tagOutdoor), /*#__PURE__*/React.createElement("span", {
    className: "visit-tag"
  }, t.visit.tagCocktails), /*#__PURE__*/React.createElement("span", {
    className: "visit-tag"
  }, t.visit.tagVegetarian), /*#__PURE__*/React.createElement("span", {
    className: "visit-tag"
  }, t.visit.tagWalkIn))), /*#__PURE__*/React.createElement("div", {
    className: "visit-block"
  }, /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, t.visit.perPerson), /*#__PURE__*/React.createElement("span", {
    className: "value"
  }, "\u20AC10 \u2013 \u20AC15"))), /*#__PURE__*/React.createElement("div", {
    className: "visit-map reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "map-canvas"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 600 600",
    preserveAspectRatio: "none",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("pattern", {
    id: "grid",
    width: "40",
    height: "40",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 40 0 L 0 0 0 40",
    fill: "none",
    stroke: "rgba(245,240,232,0.1)",
    strokeWidth: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "600",
    height: "600",
    fill: "url(#grid)"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 0 320 Q 150 280, 280 310 T 600 290 L 600 600 L 0 600 Z",
    fill: "rgba(201,169,97,0.06)",
    stroke: "rgba(201,169,97,0.4)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 80 200 Q 200 180, 320 220 T 540 240",
    fill: "none",
    stroke: "rgba(245,240,232,0.15)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 60 380 L 340 360 L 380 280 L 540 300",
    fill: "none",
    stroke: "rgba(245,240,232,0.18)",
    strokeWidth: "1",
    strokeDasharray: "3 4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "map-pin",
    "aria-hidden": "true"
  })), /*#__PURE__*/React.createElement("div", {
    className: "map-overlay-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono",
    style: {
      color: 'rgba(245,240,232,0.55)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--gold)'
    }
  }, "\u25CF"), " ", t.visit.mapBay), /*#__PURE__*/React.createElement("div", {
    className: "map-place"
  }, t.visit.mapPlaceA, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("em", null, t.visit.mapPlaceEm))), /*#__PURE__*/React.createElement("div", {
    className: "map-overlay-bottom"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "map-coords"
  }, "K CENTAR \xB7 SUB CITY"), /*#__PURE__*/React.createElement("div", {
    className: "map-coords",
    style: {
      marginTop: 6
    }
  }, "SREBRENO \xB7 ", t.htmlLang === 'hr' ? 'HRVATSKA' : 'CROATIA')), /*#__PURE__*/React.createElement("a", {
    href: "https://maps.google.com/?q=\u0160etali\u0161te+dr.+Franje+Tu\u0111mana+2a+Srebreno",
    target: "_blank",
    rel: "noreferrer",
    className: "map-directions"
  }, t.visit.mapDirections, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14
    }
  }, "\u2197")))))));
}
function Footer({
  t
}) {
  return /*#__PURE__*/React.createElement("footer", null, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "foot-top"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "foot-brand"
  }, "SUB \xB7 GOURMET"), /*#__PURE__*/React.createElement("p", {
    className: "foot-tag"
  }, t.footer.tag)), /*#__PURE__*/React.createElement("div", {
    className: "foot-col"
  }, /*#__PURE__*/React.createElement("h5", null, t.footer.visit), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#about"
  }, t.footer.lAbout)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#menu"
  }, t.footer.lMenu)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#gallery"
  }, t.footer.lGallery)), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "#visit"
  }, t.footer.lFindUs)))), /*#__PURE__*/React.createElement("div", {
    className: "foot-col"
  }, /*#__PURE__*/React.createElement("h5", null, t.footer.contact), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "tel:+38520642111"
  }, "+385 20 642 111")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@subgourmet.hr"
  }, "hello@subgourmet.hr")), /*#__PURE__*/React.createElement("li", null, "\u0160etali\u0161te dr. Franje Tu\u0111mana 2a"), /*#__PURE__*/React.createElement("li", null, "20207 Srebreno, ", t.htmlLang === 'hr' ? 'Hrvatska' : 'Croatia'))), /*#__PURE__*/React.createElement("div", {
    className: "foot-col"
  }, /*#__PURE__*/React.createElement("h5", null, t.footer.follow), /*#__PURE__*/React.createElement("div", {
    className: "foot-social"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Instagram"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "3",
    width: "18",
    height: "18",
    rx: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17.5",
    cy: "6.5",
    r: "0.7",
    fill: "currentColor"
  }))), /*#__PURE__*/React.createElement("a", {
    href: "#",
    "aria-label": "Facebook"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M14 9h3V6h-3a3 3 0 0 0-3 3v2H8v3h3v7h3v-7h3l1-3h-4V9z"
  })))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 13,
      color: 'rgba(245,240,232,0.55)',
      marginTop: 14
    }
  }, "@subcaffegourmet"))), /*#__PURE__*/React.createElement("div", {
    className: "foot-bottom"
  }, /*#__PURE__*/React.createElement("span", null, t.footer.copyright), /*#__PURE__*/React.createElement("span", null, t.footer.designed))));
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
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -60px 0px'
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Nav, {
    scrolled: scrolled,
    dark: overDark,
    lang: lang,
    setLang: setLang,
    t: t
  }), /*#__PURE__*/React.createElement(Hero, {
    t: t
  }), /*#__PURE__*/React.createElement(About, {
    t: t
  }), /*#__PURE__*/React.createElement(MenuSection, {
    lang: lang,
    t: t
  }), /*#__PURE__*/React.createElement(Gallery, {
    t: t
  }), /*#__PURE__*/React.createElement(Visit, {
    t: t
  }), /*#__PURE__*/React.createElement(Footer, {
    t: t
  }));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
