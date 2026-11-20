import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { SiteFooterComponent } from '../../layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../layout/site-header/site-header.component';
import { HeroSection } from '../../sections/hero/hero.section';
import { HoneysSection } from '../../sections/honeys/honeys.section';
import { OriginSection } from '../../sections/origin/origin.section';
import { PartnershipsSection } from '../../sections/partnerships/partnerships.section';
import { ScienceSection } from '../../sections/science/science.section';
import { StorySection } from '../../sections/story/story.section';

/**
 * One-page layout. Narrative order: emotion & origin → product → evidence →
 * people → commercial opportunity.
 */
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    SiteHeaderComponent,
    SiteFooterComponent,
    HeroSection,
    OriginSection,
    HoneysSection,
    ScienceSection,
    StorySection,
    PartnershipsSection,
  ],
  template: `
    <a class="skip-link" [routerLink]="[]" fragment="main-content">{{ t().a11y.skipToContent }}</a>
    <app-site-header />
    <main id="main-content" tabindex="-1">
      <app-hero-section />
      <app-origin-section />
      <app-honeys-section />
      <app-science-section />
      <app-story-section />
      <app-partnerships-section />
    </main>
    <app-site-footer />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {
  protected readonly t = inject(I18nService).t;

  constructor() {
    // Anchor scrolling leaves room for the fixed header.
    const document = inject(DOCUMENT);
    inject(ViewportScroller).setOffset(() => {
      const header = document.querySelector('app-site-header header');
      return [0, header ? header.getBoundingClientRect().height : 0];
    });
  }
}
