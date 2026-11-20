import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Dictionary } from '../../../core/i18n/i18n.types';

export type OriginMapLabels = Dictionary['origin']['map'];

/**
 * Schematic, not-to-scale map of the Nahuelbuta range. It intentionally shows
 * no coordinates or apiary locations — only a referential zone.
 */
@Component({
  selector: 'app-origin-map',
  templateUrl: './origin-map.component.html',
  styleUrl: './origin-map.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OriginMapComponent {
  readonly labels = input.required<OriginMapLabels>();
}
