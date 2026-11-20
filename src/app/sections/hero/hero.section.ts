import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { MEDIA } from '../../data/media.data';
import { SECTION_IDS } from '../../data/sections.data';
import { CtaLinkComponent } from '../../shared/components/cta-link/cta-link.component';
import { MediaPlaceholderComponent } from '../../shared/components/media-placeholder/media-placeholder.component';
import { WaxSealComponent } from '../../shared/components/wax-seal/wax-seal.component';

@Component({
  selector: 'app-hero-section',
  imports: [CtaLinkComponent, MediaPlaceholderComponent, WaxSealComponent],
  templateUrl: './hero.section.html',
  styleUrl: './hero.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.home;
  protected readonly honeysId = SECTION_IDS.honeys;
  protected readonly partnershipsId = SECTION_IDS.partnerships;
  protected readonly media = MEDIA.hero;
}
