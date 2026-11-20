import { ViewportScroller } from '@angular/common';
import { ChangeDetectionStrategy, Component, DOCUMENT, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { SiteFooterComponent } from '../../layout/site-footer/site-footer.component';
import { SiteHeaderComponent } from '../../layout/site-header/site-header.component';
import { CredentialsSection } from '../../sections/credentials/credentials.section';
import { FaqSection } from '../../sections/faq/faq.section';
import { HeroSection } from '../../sections/hero/hero.section';
import { HoneysSection } from '../../sections/honeys/honeys.section';
import { OriginSection } from '../../sections/origin/origin.section';
import { PartnershipsSection } from '../../sections/partnerships/partnerships.section';
import { RitualsSection } from '../../sections/rituals/rituals.section';
import { ScienceSection } from '../../sections/science/science.section';
import { StorySection } from '../../sections/story/story.section';
import { BeeFlightComponent } from '../../shared/components/bee-flight/bee-flight.component';

/**
 * One-page layout. Narrative: emotion (hero) → trust (credentials) → desire
 * (honeys) → origin & hive → people → evidence → rituals → partnership → FAQ.
 */
@Component({
  selector: 'app-home-page',
  imports: [
    RouterLink,
    SiteHeaderComponent,
    SiteFooterComponent,
    BeeFlightComponent,
    HeroSection,
    CredentialsSection,
    HoneysSection,
    OriginSection,
    StorySection,
    ScienceSection,
    RitualsSection,
    PartnershipsSection,
    FaqSection,
  ],
  template: `
    <a class="skip-link" [routerLink]="[]" fragment="main-content">{{ t().a11y.skipToContent }}</a>
    <app-site-header />
    <main id="main-content" class="page" tabindex="-1">
      <app-bee-flight />
      <app-hero-section />
      <app-credentials-section />
      <app-honeys-section />
      <app-origin-section />
      <app-story-section />
      <app-science-section />
      <app-rituals-section />
      <app-partnerships-section />
      <app-faq-section />
    </main>
    <app-site-footer />
  `,
  styles: `
    .page {
      position: relative;
      display: block;
    }
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
