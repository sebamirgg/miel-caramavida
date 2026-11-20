import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type FlagCountry = 'cl' | 'gb' | 'de' | 'cn' | 'jp';

let nextId = 0;

/** Five-pointed star path centred on (cx, cy), optionally rotated (degrees). */
function star(cx: number, cy: number, r: number, rotation = 0): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? r : r * 0.382;
    const angle = ((rotation - 90 + i * 36) * Math.PI) / 180;
    points.push(`${(cx + radius * Math.cos(angle)).toFixed(2)},${(cy + radius * Math.sin(angle)).toFixed(2)}`);
  }
  return `M${points.join('L')}Z`;
}

/**
 * Small inline SVG flag (emoji flags do not render on Windows).
 * Always decorative: the language name is shown next to it as text.
 */
@Component({
  selector: 'app-flag',
  template: `
    <svg viewBox="0 0 30 20" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      @switch (country()) {
        @case ('cl') {
          <rect width="30" height="20" fill="#d52b1e" />
          <rect width="30" height="10" fill="#fff" />
          <rect width="10" height="10" fill="#0039a6" />
          <path [attr.d]="chileStar" fill="#fff" />
        }
        @case ('gb') {
          <defs>
            <clipPath [id]="clipId"><path d="M15 10h15v10zv10H0zH0V0zV0h15z" /></clipPath>
          </defs>
          <rect width="30" height="20" fill="#012169" />
          <path d="M0 0l30 20M30 0L0 20" stroke="#fff" stroke-width="4" />
          <path d="M0 0l30 20M30 0L0 20" stroke="#c8102e" stroke-width="2.4" [attr.clip-path]="'url(#' + clipId + ')'" />
          <path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6" />
          <path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3.6" />
        }
        @case ('de') {
          <rect width="30" height="20" fill="#ffce00" />
          <rect width="30" height="13.34" fill="#dd0000" />
          <rect width="30" height="6.67" fill="#000" />
        }
        @case ('cn') {
          <rect width="30" height="20" fill="#de2910" />
          @for (d of chinaStars; track $index) {
            <path [attr.d]="d" fill="#ffde00" />
          }
        }
        @case ('jp') {
          <rect width="30" height="20" fill="#fff" />
          <circle cx="15" cy="10" r="6" fill="#bc002d" />
        }
      }
    </svg>
  `,
  styles: `
    :host {
      display: inline-block;
      flex-shrink: 0;
      width: 1.5rem;
      height: 1rem;
      overflow: hidden;
      border-radius: 2px;
      box-shadow:
        0 0 0 1px rgb(35 26 20 / 12%),
        0 1px 2px rgb(35 26 20 / 15%);
      line-height: 0;
    }
    svg {
      width: 100%;
      height: 100%;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlagComponent {
  readonly country = input.required<FlagCountry>();

  protected readonly clipId = `flag-clip-${nextId++}`;
  protected readonly chileStar = star(5, 5, 3);
  protected readonly chinaStars = [
    star(5, 5, 3),
    star(10, 2, 1, 23),
    star(12, 4, 1, 45),
    star(12, 7, 1, 70),
    star(10, 9, 1, 20),
  ];
}
