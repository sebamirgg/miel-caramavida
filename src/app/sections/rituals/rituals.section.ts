import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { MEDIA } from '../../data/media.data';
import { SECTION_IDS } from '../../data/sections.data';
import { MediaPlaceholderComponent } from '../../shared/components/media-placeholder/media-placeholder.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/** Ritual & pairing guide: bento grid. Tile tones follow the item order in i18n. */
@Component({
  selector: 'app-rituals-section',
  imports: [MediaPlaceholderComponent, RevealDirective],
  templateUrl: './rituals.section.html',
  styleUrl: './rituals.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RitualsSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.rituals;
  protected readonly photo = MEDIA.rituals;
  protected readonly tones = ['photo', 'forest', 'honey', 'ivory', 'bark'] as const;
}
