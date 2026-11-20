import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { MEDIA } from '../../data/media.data';
import { SECTION_IDS } from '../../data/sections.data';
import { MediaPlaceholderComponent } from '../../shared/components/media-placeholder/media-placeholder.component';
import { OriginMapComponent } from '../../shared/components/origin-map/origin-map.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-origin-section',
  imports: [OriginMapComponent, MediaPlaceholderComponent, RevealDirective],
  templateUrl: './origin.section.html',
  styleUrl: './origin.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OriginSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.origin;
  protected readonly landscape = MEDIA.origin;
}
