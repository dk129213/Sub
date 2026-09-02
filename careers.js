/* Careers page: language toggle, validation, and submission.
 *
 * Posts to apply.php, which validates everything again server-side and emails
 * the application with the CV attached. Mailbox credentials live in config.php
 * on the server and never reach the browser - see apply.php for setup.
 *
 * To use a hosted form service instead (Formspree, Web3Forms), point ENDPOINT
 * at its URL; the field names below are sent as-is.
 */
var ENDPOINT = 'apply.php';

var EMAIL = 'info@subgourmet.hr';
var MAX_CV_BYTES = 5 * 1024 * 1024;

var T = {
  hr: {
    navAbout: 'O nama', navMenu: 'Meni', navGallery: 'Galerija',
    navVisit: 'Posjetite nas', navJoin: 'Postani dio tima',
    eyebrow: 'Otvorena prijava',
    h1: 'Postani dio tima',
    lede: 'Prijave su otvorene tijekom cijele godine. Ostavite svoje podatke i javit ćemo vam se kada se otvori mjesto koje odgovara vašem iskustvu.',
    lblFirstName: 'Ime', lblLastName: 'Prezime', lblEmail: 'E-mail', lblPhone: 'Telefon',
    lblPosition: 'Pozicija za koju se prijavljujete',
    optChoose: 'Odaberite poziciju',
    optWaiter: 'Konobar', optCook: 'Kuhar', optAsstCook: 'Pomoćni kuhar',
    lblCv: 'Životopis (CV)',
    cvHint: 'PDF ili Word dokument, najviše 5 MB',
    lblMessage: 'Poruka', optional: '(nije obavezno)',
    consent: 'Suglasan/na sam da Sub Gourmet obrađuje i čuva moje osobne podatke i životopis u svrhu zapošljavanja. Privolu mogu povući u svakom trenutku na',
    submit: 'Pošalji prijavu',
    sending: 'Šaljem…',
    asideRolesLbl: 'Pozicije', asideWhereLbl: 'Gdje', asideContactLbl: 'Kontakt',
    backHome: 'Natrag na naslovnicu',
    errRequired: 'Ovo polje je obavezno.',
    errEmail: 'Unesite ispravnu e-mail adresu.',
    errPhone: 'Unesite ispravan broj telefona.',
    errConsent: 'Molimo potvrdite privolu.',
    errFileType: 'Dozvoljeni su PDF i Word dokumenti.',
    errFileSize: 'Datoteka je prevelika (najviše 5 MB).',
    okSent: 'Hvala! Vaša prijava je poslana. Javit ćemo vam se uskoro.',
    errSend: 'Slanje nije uspjelo. Pošaljite prijavu na ' + EMAIL + ' i rado ćemo je pregledati.'
  },
  en: {
    navAbout: 'About', navMenu: 'Menu', navGallery: 'Gallery',
    navVisit: 'Visit', navJoin: 'Join the Team',
    eyebrow: 'Open Application',
    h1: 'Join the Team',
    lede: 'We accept applications all year round. Leave your details and we will be in touch when a role that fits your experience opens up.',
    lblFirstName: 'First name', lblLastName: 'Last name', lblEmail: 'Email', lblPhone: 'Phone',
    lblPosition: 'Position you are applying for',
    optChoose: 'Choose a position',
    optWaiter: 'Waiter', optCook: 'Cook', optAsstCook: 'Assistant cook',
    lblCv: 'CV',
    cvHint: 'PDF or Word document, 5 MB maximum',
    lblMessage: 'Message', optional: '(optional)',
    consent: 'I agree that Sub Gourmet may process and store my personal data and CV for recruitment purposes. I can withdraw this consent at any time at',
    submit: 'Send application',
    sending: 'Sending…',
    asideRolesLbl: 'Positions', asideWhereLbl: 'Where', asideContactLbl: 'Contact',
    backHome: 'Back to homepage',
    errRequired: 'This field is required.',
    errEmail: 'Please enter a valid email address.',
    errPhone: 'Please enter a valid phone number.',
    errConsent: 'Please confirm your consent.',
    errFileType: 'PDF and Word documents only.',
    errFileSize: 'File is too large (5 MB maximum).',
    okSent: 'Thank you! Your application has been sent. We will be in touch soon.',
    errSend: 'Sending failed. Please email your application to ' + EMAIL + ' and we will gladly review it.'
  }
};

/*
 * The page is served per language: /careers.html is Croatian, /en/careers.html
 * English, each with its text already in the HTML. This only needs to know
 * which one it is, so the form's messages match.
 */
var lang = (typeof window !== 'undefined' && window.SITE_LANG === 'en') ? 'en' : 'hr';

function t(key) { return (T[lang] && T[lang][key]) || T.hr[key] || key; }

// ─────────────── validation ───────────────
function fieldOf(input) { return input.closest('.field'); }

function setError(input, message) {
  var field = fieldOf(input);
  var slot = field && field.querySelector('[data-error-for="' + input.id + '"]');
  if (field) field.classList.toggle('has-error', !!message);
  if (slot) {
    slot.textContent = message || '';
    slot.classList.toggle('show', !!message);
  }
}

function validateField(input) {
  var v = (input.value || '').trim();

  if (input.type === 'checkbox') {
    return input.checked ? (setError(input, ''), true) : (setError(input, t('errConsent')), false);
  }
  if (input.type === 'file') {
    var f = input.files && input.files[0];
    if (!f) { setError(input, t('errRequired')); return false; }
    if (!/\.(pdf|docx?)$/i.test(f.name)) { setError(input, t('errFileType')); return false; }
    if (f.size > MAX_CV_BYTES) { setError(input, t('errFileSize')); return false; }
    setError(input, ''); return true;
  }
  if (!v) { setError(input, t('errRequired')); return false; }
  if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    setError(input, t('errEmail')); return false;
  }
  if (input.type === 'tel') {
    var digits = v.replace(/[^\d]/g, '');
    if (digits.length < 8 || digits.length > 15) { setError(input, t('errPhone')); return false; }
  }
  setError(input, ''); return true;
}

function requiredInputs(form) {
  return Array.prototype.slice.call(form.querySelectorAll('[required]'));
}

// ─────────────── boot ───────────────
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.lang-toggle .lang-btn').forEach(function (a) {
    a.classList.toggle('active', a.getAttribute('data-lang') === lang);
  });

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var form = document.getElementById('applyForm');
  var status = document.getElementById('formStatus');
  var submitBtn = document.getElementById('submitBtn');
  var cv = document.getElementById('cv');
  var drop = document.getElementById('fileDrop');
  var fileLabel = document.getElementById('fileLabel');

  cv.addEventListener('change', function () {
    var f = cv.files && cv.files[0];
    drop.classList.toggle('has-file', !!f);
    fileLabel.textContent = f
      ? f.name + '  ·  ' + (f.size / 1048576).toFixed(1) + ' MB'
      : t('cvHint');
    validateField(cv);
  });

  ['dragenter', 'dragover'].forEach(function (ev) {
    drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-dragover'); });
  });
  ['dragleave', 'drop'].forEach(function (ev) {
    drop.addEventListener(ev, function () { drop.classList.remove('is-dragover'); });
  });

  // Validate on blur once touched, so errors appear after leaving a field
  // rather than while the applicant is still typing.
  requiredInputs(form).forEach(function (input) {
    input.addEventListener('blur', function () { validateField(input); });
    input.addEventListener('input', function () {
      if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    status.className = 'form-status';

    var inputs = requiredInputs(form);
    var firstBad = null;
    inputs.forEach(function (input) {
      if (!validateField(input) && !firstBad) firstBad = input;
    });
    if (firstBad) {
      firstBad.focus();
      if (firstBad.type === 'file') drop.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var data = new FormData(form);
    data.append('_subject', 'Prijava za posao — Sub Gourmet');

    submitBtn.disabled = true;
    var submitLabel = submitBtn.querySelector('[data-i18n="submit"]');
    var restore = submitLabel.textContent;
    submitLabel.textContent = t('sending');

    fetch(ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        drop.classList.remove('has-file');
        fileLabel.textContent = t('cvHint');
        status.textContent = t('okSent');
        status.className = 'form-status ok';
      })
      .catch(function () {
        status.textContent = t('errSend');
        status.className = 'form-status err';
      })
      .then(function () {
        submitBtn.disabled = false;
        submitLabel.textContent = restore;
      });
  });
});
