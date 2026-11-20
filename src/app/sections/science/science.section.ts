import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SECTION_IDS } from '../../data/sections.data';
import { StudyCardComponent } from '../../shared/components/study-card/study-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-science-section',
  imports: [StudyCardComponent, RevealDirective],
  templateUrl: './science.section.html',
  styleUrl: './science.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScienceSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.science;
}
