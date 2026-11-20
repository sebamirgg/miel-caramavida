import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SECTION_IDS } from '../../data/sections.data';
import { SITE_CONFIG } from '../../data/site.config';
import { CtaLinkComponent } from '../../shared/components/cta-link/cta-link.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-partnerships-section',
  // The contact form (./contact-form) is hidden for now: to restore it, uncomment its
  // block in the template and add ContactFormComponent back to these imports.
  imports: [CtaLinkComponent, RevealDirective],
  templateUrl: './partnerships.section.html',
  styleUrl: './partnerships.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PartnershipsSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.partnerships;
  protected readonly contactId = SECTION_IDS.contact;
  protected readonly showSamplesCta = SITE_CONFIG.features.showSamplesCta;
}
