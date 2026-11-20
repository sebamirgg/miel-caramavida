import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SECTION_IDS } from '../../data/sections.data';
import { SITE_CONFIG } from '../../data/site.config';
import { CtaLinkComponent } from '../../shared/components/cta-link/cta-link.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-partnerships-section',
  imports: [CtaLinkComponent, ContactFormComponent, RevealDirective],
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
