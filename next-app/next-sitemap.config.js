/** @type {import('next-sitemap').IConfig} */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function getRepoLastMod(){
  try {
    const iso = execSync('git log -1 --format=%cI', { encoding: 'utf-8' }).trim();
    if(iso) return iso;
  } catch(e) {}
  return new Date().toISOString();
}

const repoLastMod = getRepoLastMod();

module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.zoe-solar.de',
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: ['/api/*'],
  additionalPaths: async (config) => {
    // Standorte
    const geoDir = path.join(process.cwd(), 'src', 'app', 'standorte');
    let cityDirs = [];
    try {
      cityDirs = fs.readdirSync(geoDir)
        .filter(d => !d.startsWith('.') && d !== 'page.tsx' && fs.statSync(path.join(geoDir, d)).isDirectory());
    } catch(e) {}
    const geoPaths = ['/standorte', ...cityDirs.map(d => `/standorte/${d}`)];

    // Förderung generiert
    const foerderGenDir = path.join(process.cwd(),'content','generated','foerderung');
    let foerderPaths = [];
    try {
      foerderPaths = fs.readdirSync(foerderGenDir)
        .filter(f=>f.endsWith('.mdx'))
        .map(f=> `/foerderung/${f.replace(/\.mdx$/,'')}`);
    } catch(e) {}

    const all = [...geoPaths, ...foerderPaths];
    return Promise.all(all.map(p => config.transform(config, p)));
  },
  transform: async (config, urlPath) => {
    const locales = ['de','en'];
    const defaultLocale = 'de';
    const norm = p => p === '/' ? '/' : ('/' + p.replace(/^\/+|\/+$/g,'')).replace(/\/+/g,'/');
    const basePath = norm(urlPath);
    // Hinweis: next-sitemap hängt den loc Pfad offenbar an alternateRefs.href an.
    // Deshalb nur die Basis-Root (Domain + optional Locale Präfix) liefern, NICHT den Pfad erneut.
    const altRefs = [];
    for(const l of locales){
      if(l === defaultLocale){
        altRefs.push({ href: config.siteUrl, hreflang: l });
      } else {
        altRefs.push({ href: config.siteUrl + '/' + l, hreflang: l });
      }
    }
    altRefs.push({ href: config.siteUrl, hreflang: 'x-default' });
    return {
      loc: basePath,
      changefreq: 'weekly',
      priority: basePath === '/' ? 1.0 : 0.7,
      lastmod: repoLastMod,
      alternateRefs: altRefs
    };
  }
};
