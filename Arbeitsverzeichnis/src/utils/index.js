export function createPageUrl(name) {
  const map = {
    Home: '/',
    WhyUs: '/warum-zoe',
    Technology: '/technologie',
    Projects: '/projekte',
    About: '/ueber-uns',
    Pricing: '/preise-kosten',
    Financing: '/finanzierung-foerderung',
    Service: '/service',
    Faq: '/faq',
    SuccessStories: '/erfolgsgeschichten',
    Blog: '/blog',
    Guide: '/guide',
    Calculator: '/rechner',
    Deals: '/angebote',
    Contact: '/kontakt',
  Imprint: '/impressum',
  Privacy: '/datenschutz',
  };
  return map[name] || '/';
}

// UI preference helpers
export function setReduceMotion(value) {
  try {
    const v = value === true || value === 'true'
    localStorage.setItem('ui:reduce-motion', v ? 'true' : 'false')
    const root = document.documentElement
    if (v) root.setAttribute('data-reduce-motion', 'true')
    else root.removeAttribute('data-reduce-motion')
  } catch {}
}

export function setContrast(mode) {
  try {
    const m = mode === 'plus' ? 'plus' : 'default'
    localStorage.setItem('ui:contrast', m)
    const root = document.documentElement
    if (m === 'plus') root.setAttribute('data-contrast', 'plus')
    else root.removeAttribute('data-contrast')
  } catch {}
}

export function getUIPreferences() {
  try {
    return {
      reduceMotion: localStorage.getItem('ui:reduce-motion') === 'true',
      contrast: localStorage.getItem('ui:contrast') || 'default',
    }
  } catch {
    return { reduceMotion: false, contrast: 'default' }
  }
}
