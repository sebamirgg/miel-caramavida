import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { I18nService } from '../../../core/i18n/i18n.service';
import { Dictionary } from '../../../core/i18n/i18n.types';
import { HONEY_VISUALS, HoneyId, isHoneyId } from '../../../data/honeys.data';
import { SECTION_IDS } from '../../../data/sections.data';
import { CtaLinkComponent } from '../cta-link/cta-link.component';
import { MediaPlaceholderComponent } from '../media-placeholder/media-placeholder.component';

export type HoneyContent = Dictionary['honeys']['items'][number];
export type HoneyLabels = Dictionary['honeys']['labels'];

const INTENSITY_STEPS = [1, 2, 3, 4, 5] as const;

@Component({
  selector: 'app-honey-card',
  imports: [MediaPlaceholderComponent, CtaLinkComponent],
  templateUrl: './honey-card.component.html',
  styleUrl: './honey-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"honey--" + id()' },
})
export class HoneyCardComponent {
  protected readonly t = inject(I18nService).t;
  protected readonly partnershipsId = SECTION_IDS.partnerships;
  protected readonly steps = INTENSITY_STEPS;

  readonly honey = input.required<HoneyContent>();
  readonly labels = input.required<HoneyLabels>();
  readonly availability = input.required<string>();

  protected readonly id = computed<HoneyId>(() => {
    const id = this.honey().id;
    return isHoneyId(id) ? id : 'ulmo';
  });
  protected readonly visual = computed(() => HONEY_VISUALS[this.id()]);
  protected readonly headingId = computed(() => `honey-${this.id()}-title`);
}
