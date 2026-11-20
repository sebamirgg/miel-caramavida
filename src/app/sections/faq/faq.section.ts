import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SECTION_IDS } from '../../data/sections.data';
import { CtaLinkComponent } from '../../shared/components/cta-link/cta-link.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/** FAQ accordion built on native <details>/<summary>: accessible without JavaScript. */
@Component({
  selector: 'app-faq-section',
  imports: [CtaLinkComponent, RevealDirective],
  templateUrl: './faq.section.html',
  styleUrl: './faq.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.faq;
}
