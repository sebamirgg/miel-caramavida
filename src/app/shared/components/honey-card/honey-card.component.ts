import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Dictionary } from '../../../core/i18n/i18n.types';
import { HONEY_VISUALS, HoneyId, isHoneyId } from '../../../data/honeys.data';
import { MediaPlaceholderComponent } from '../media-placeholder/media-placeholder.component';

export type HoneyContent = Dictionary['honeys']['items'][number];
export type HoneyLabels = Dictionary['honeys']['labels'];

@Component({
  selector: 'app-honey-card',
  imports: [MediaPlaceholderComponent],
  templateUrl: './honey-card.component.html',
  styleUrl: './honey-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"honey--" + id()' },
})
export class HoneyCardComponent {
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
