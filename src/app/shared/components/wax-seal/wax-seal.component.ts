import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BeeIconComponent } from '../bee-icon/bee-icon.component';

let nextId = 0;

/**
 * Circular wax-seal / origin badge: text set on a slowly turning ring around
 * a bee emblem. The text is exposed once to assistive tech via aria-label.
 */
@Component({
  selector: 'app-wax-seal',
  imports: [BeeIconComponent],
  template: `
    <div class="seal" role="img" [attr.aria-label]="text()">
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs>
          <radialGradient [id]="gradientId" cx="38%" cy="32%" r="75%">
            <stop offset="0" stop-color="#f3d08a" />
            <stop offset=".55" stop-color="#c88a2b" />
            <stop offset="1" stop-color="#8a5512" />
          </radialGradient>
          <path [id]="pathId" d="M100 100m-71 0a71 71 0 1 1 142 0a71 71 0 1 1-142 0" />
        </defs>
        <circle cx="100" cy="100" r="97" [attr.fill]="'url(#' + gradientId + ')'" />
        <circle class="seal__line" cx="100" cy="100" r="88" />
        <circle class="seal__line" cx="100" cy="100" r="54" />
        <g class="seal__ring">
          <text>
            <textPath [attr.href]="'#' + pathId" textLength="440" lengthAdjust="spacing">{{ ringText() }}</textPath>
          </text>
        </g>
      </svg>
      <app-bee-icon class="seal__bee" />
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      width: 9.5rem;
      aspect-ratio: 1;
      filter: drop-shadow(0 14px 22px rgb(35 26 20 / 30%));
    }
    .seal {
      position: relative;
      width: 100%;
      height: 100%;
    }
    svg {
      width: 100%;
      height: 100%;
    }
    .seal__line {
      fill: none;
      stroke: rgb(35 26 20 / 35%);
      stroke-width: 0.8;
    }
    .seal__ring {
      transform-box: view-box;
      transform-origin: 50% 50%;
      animation: seal-turn 40s linear infinite;
    }
    text {
      fill: #2a1d12;
      font-family: var(--font-sans);
      font-size: 11.5px;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }
    .seal__bee {
      position: absolute;
      inset: 50% auto auto 50%;
      color: #2a1d12;
      font-size: 2.9rem;
      transform: translate(-50%, -50%);
    }
    @keyframes seal-turn {
      to {
        transform: rotate(360deg);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .seal__ring {
        animation: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaxSealComponent {
  readonly text = input.required<string>();

  private readonly uid = nextId++;
  protected readonly pathId = `seal-path-${this.uid}`;
  protected readonly gradientId = `seal-gradient-${this.uid}`;
  protected readonly ringText = computed(() => `${this.text()} · `);
}
