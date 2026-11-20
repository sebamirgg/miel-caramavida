import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { SECTION_IDS } from '../../data/sections.data';
import { HoneyCardComponent } from '../../shared/components/honey-card/honey-card.component';
import { RevealDirective } from '../../shared/directives/reveal.directive';

@Component({
  selector: 'app-honeys-section',
  imports: [HoneyCardComponent, RevealDirective],
  template: `
    <section [id]="id" class="section section--alt honeycomb" tabindex="-1" aria-labelledby="honeys-title">
      <div class="container">
        <header class="section-header section-header--center" appReveal>
          <p class="eyebrow">{{ t().honeys.eyebrow }}</p>
          <h2 id="honeys-title" class="section-title">{{ t().honeys.title }}</h2>
          <hr class="rule" />
          <p class="section-intro">{{ t().honeys.intro }}</p>
        </header>

        <ul class="honeys" role="list">
          @for (honey of t().honeys.items; track honey.id) {
            <li appReveal>
              <app-honey-card
                [honey]="honey"
                [labels]="t().honeys.labels"
                [availability]="t().honeys.availability"
              />
            </li>
          }
        </ul>
      </div>
    </section>
  `,
  styles: `
    .honeys {
      display: grid;
      gap: var(--space-6);
      list-style: none;
    }
    .honeys li,
    app-honey-card {
      height: 100%;
    }
    @media (min-width: 56rem) {
      .honeys {
        grid-template-columns: 1fr 1fr;
        gap: var(--space-7);
      }
      /* Offset the second card for an editorial rhythm. */
      .honeys li:nth-child(2) {
        margin-top: var(--space-8);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoneysSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.honeys;
}
