import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Minimal fine-line bee. Decorative: size and colour come from the host (font-size / color). */
@Component({
  selector: 'app-bee-icon',
  template: `
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <path class="wing" d="M12 14.2C7.6 13.4 4.4 10.6 5.3 8c.9-2.6 5-1.4 7.6 4.6" />
      <path class="wing" d="M20 14.2c4.4-.8 7.6-3.6 6.7-6.2-.9-2.6-5-1.4-7.6 4.6" />
      <ellipse cx="16" cy="19.5" rx="4.6" ry="6.6" />
      <path d="M11.6 17.6h8.8M11.5 20.9h9M12.6 24.1h6.8" />
      <circle cx="16" cy="10.6" r="2.4" />
      <path d="M14.9 8.5 13 5.4M17.1 8.5 19 5.4M16 26.1v2.1" />
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 1em;
      height: 1em;
    }
    svg {
      width: 100%;
      height: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.1;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .wing {
      fill: currentColor;
      fill-opacity: 0.12;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeeIconComponent {}
