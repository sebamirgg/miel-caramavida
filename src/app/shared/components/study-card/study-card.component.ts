import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Dictionary } from '../../../core/i18n/i18n.types';

/** One study result. `reportUrl` points to a PDF in `public/reports/` (or null). */
export interface StudyContent {
  id: string;
  title: string;
  date: string;
  methodology: string;
  sample: string;
  laboratory: string;
  reportUrl: string | null;
}

export type StudyLabels = Dictionary['science']['studyLabels'];

@Component({
  selector: 'app-study-card',
  templateUrl: './study-card.component.html',
  styleUrl: './study-card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyCardComponent {
  readonly study = input.required<StudyContent>();
  readonly labels = input.required<StudyLabels>();
}
