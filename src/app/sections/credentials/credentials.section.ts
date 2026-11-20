import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SECTION_IDS } from '../../data/sections.data';
import { RevealDirective } from '../../shared/directives/reveal.directive';

/**
 * Purity credentials bar. Items flagged `example: true` in i18n are
 * illustrative claims pending confirmation and are visibly marked as such.
 */
@Component({
  selector: 'app-credentials-section',
  imports: [RevealDirective],
  templateUrl: './credentials.section.html',
  styleUrl: './credentials.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CredentialsSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.credentials;
  protected readonly hasExamples = computed(() => this.t().credentials.items.some((item) => item.example));
}
