import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { MEDIA } from '../../data/media.data';
import { SECTION_IDS } from '../../data/sections.data';
import { MediaPlaceholderComponent } from '../../shared/components/media-placeholder/media-placeholder.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-story-section',
  imports: [MediaPlaceholderComponent, RevealDirective],
  templateUrl: './story.section.html',
  styleUrl: './story.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorySection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.story;

  /** Pairs each gallery image (data/media.data.ts) with its translated alt text. */
  protected readonly gallery = computed(() =>
    MEDIA.gallery.map((asset, index) => ({
      asset,
      alt: this.t().story.gallery[index] ?? '',
    })),
  );
}
