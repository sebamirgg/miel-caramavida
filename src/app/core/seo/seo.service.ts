import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { SITE_CONFIG } from '../../data/site.config';
import { DEFAULT_LANG, Dictionary, LANG_META, Lang, SUPPORTED_LANGS } from '../i18n/i18n.types';

const JSON_LD_ID = 'ld-organization';
const FONTS_LINK_ID = 'lang-fonts';

/**
 * Per-language SEO: <html lang>, <title>, meta description, Open Graph and an
 * Organization JSON-LD block. Runs during SSR/prerender, so crawlers receive
 * the final tags in the HTML.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  apply(lang: Lang, t: Dictionary): void {
    this.document.documentElement.setAttribute('lang', LANG_META[lang].htmlLang);
    this.applyLanguageFonts(lang);
    this.title.setTitle(t.meta.title);

    const tags: MetaDefinition[] = [
      { name: 'description', content: t.meta.description },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: t.brand.name },
      { property: 'og:title', content: t.meta.title },
      { property: 'og:description', content: t.meta.description },
      { property: 'og:locale', content: t.meta.ogLocale },
      { property: 'og:locale:alternate', content: t.meta.ogLocaleAlternate },
      { name: 'twitter:card', content: 'summary_large_image' },
    ];
    if (SITE_CONFIG.ogImage) {
      tags.push({ property: 'og:image', content: SITE_CONFIG.ogImage });
    }
    tags.forEach((tag) => this.meta.updateTag(tag));

    this.applyAlternateLinks(lang);
    this.applyJsonLd(t);
  }

  /**
   * Canonical + hreflang. Requires an absolute base URL, so it stays inactive
   * until `SITE_CONFIG.siteUrl` is set. Resulting tags:
   *   <link rel="canonical" href="https://domain/es">
   *   <link rel="alternate" hreflang="es" href="https://domain/es">
   *   <link rel="alternate" hreflang="en" href="https://domain/en">
   *   <link rel="alternate" hreflang="x-default" href="https://domain/es">
   */
  private applyAlternateLinks(lang: Lang): void {
    const base = SITE_CONFIG.siteUrl;
    if (!base) return;
    this.meta.updateTag({ property: 'og:url', content: `${base}/${lang}` });
    this.upsertLink('canonical', null, `${base}/${lang}`);
    for (const code of SUPPORTED_LANGS) {
      this.upsertLink('alternate', LANG_META[code].htmlLang, `${base}/${code}`);
    }
    this.upsertLink('alternate', 'x-default', `${base}/${DEFAULT_LANG}`);
  }

  /** CJK fonts are large, so they are only requested on the pages that need them. */
  private applyLanguageFonts(lang: Lang): void {
    const href = LANG_META[lang].fontsHref;
    let link = this.document.getElementById(FONTS_LINK_ID);
    if (!href) {
      link?.remove();
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.id = FONTS_LINK_ID;
      link.setAttribute('rel', 'stylesheet');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private upsertLink(rel: string, hreflang: string | null, href: string): void {
    const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]`;
    let link = this.document.head.querySelector<HTMLLinkElement>(selector);
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', rel);
      if (hreflang) link.setAttribute('hreflang', hreflang);
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private applyJsonLd(t: Dictionary): void {
    const { contact, siteUrl } = SITE_CONFIG;
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: t.brand.company,
      description: t.meta.description,
      brand: { '@type': 'Brand', name: t.brand.name, slogan: t.brand.tagline },
      address: {
        '@type': 'PostalAddress',
        addressRegion: 'Biobío',
        addressCountry: 'CL',
      },
    };
    if (siteUrl) data['url'] = siteUrl;
    if (contact.email) data['email'] = contact.email;
    if (contact.phone) data['telephone'] = contact.phone;

    let script = this.document.getElementById(JSON_LD_ID);
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSON_LD_ID;
      script.setAttribute('type', 'application/ld+json');
      this.document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }
}
