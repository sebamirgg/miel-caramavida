import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { BeeIconComponent } from '../bee-icon/bee-icon.component';

interface Sample {
  x: number;
  y: number;
  length: number;
}

/**
 * Decorative flight path: a dotted line that meanders through the page
 * margins, crossing sides between sections, and draws itself as the visitor
 * scrolls, led by a fine-line bee.
 *
 * Place it as the first child of a `position: relative` container (the page
 * <main>). The path is computed from the real section positions and rebuilt on
 * resize. All updates bypass Angular change detection (direct DOM writes in rAF).
 * Hidden on narrow screens; static and bee-less with prefers-reduced-motion.
 */
@Component({
  selector: 'app-bee-flight',
  imports: [BeeIconComponent],
  template: `
    <svg #svg class="flight" aria-hidden="true" focusable="false">
      <defs>
        <mask #mask [attr.id]="maskId" maskUnits="userSpaceOnUse">
          <path #reveal class="flight__reveal" />
        </mask>
      </defs>
      <path #trace class="flight__trace" />
      <path #route class="flight__route" [attr.mask]="'url(#' + maskId + ')'" />
    </svg>
    <span #bee class="bee"><app-bee-icon /></span>
  `,
  styles: `
    :host {
      position: absolute;
      inset: 0;
      z-index: 3;
      display: none;
      pointer-events: none;
    }
    @media (min-width: 80rem) {
      :host {
        display: block;
      }
    }
    .flight {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      overflow: visible;
    }
    path {
      fill: none;
      stroke-linecap: round;
    }
    .flight__trace {
      stroke: rgb(200 138 43 / 18%);
      stroke-width: 1;
      stroke-dasharray: 1 9;
    }
    .flight__route {
      stroke: #c88a2b;
      stroke-width: 1.4;
      stroke-dasharray: 1.5 7;
    }
    .flight__reveal {
      stroke: #fff;
      stroke-width: 8;
    }
    .bee {
      position: absolute;
      top: 0;
      left: 0;
      color: #c88a2b;
      font-size: 1.6rem;
      opacity: 0;
      transition: opacity 0.8s ease;
      will-change: transform;
    }
    .bee.is-visible {
      opacity: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BeeFlightComponent {
  private static nextId = 0;
  protected readonly maskId = `bee-flight-mask-${BeeFlightComponent.nextId++}`;

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly svg = viewChild.required<ElementRef<SVGSVGElement>>('svg');
  private readonly trace = viewChild.required<ElementRef<SVGPathElement>>('trace');
  private readonly route = viewChild.required<ElementRef<SVGPathElement>>('route');
  private readonly reveal = viewChild.required<ElementRef<SVGPathElement>>('reveal');
  private readonly bee = viewChild.required<ElementRef<HTMLElement>>('bee');

  private samples: Sample[] = [];
  private total = 0;
  private frame = 0;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const container = this.host.nativeElement.parentElement;
      if (!container) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const rebuild = () => {
        this.build(container);
        if (reducedMotion) {
          this.reveal().nativeElement.style.strokeDasharray = 'none';
          this.bee().nativeElement.classList.remove('is-visible');
        } else {
          this.update(container);
        }
      };

      const onScroll = () => {
        if (reducedMotion || this.frame) return;
        this.frame = requestAnimationFrame(() => {
          this.frame = 0;
          this.update(container);
        });
      };

      const resizeObserver = new ResizeObserver(() => rebuild());
      resizeObserver.observe(container);
      window.addEventListener('scroll', onScroll, { passive: true });
      rebuild();

      destroyRef.onDestroy(() => {
        resizeObserver.disconnect();
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(this.frame);
      });
    });
  }

  /** Builds the meandering path from the sections' real positions. */
  private build(container: HTMLElement): void {
    const width = container.clientWidth;
    const height = container.scrollHeight;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const sections = Array.from(container.querySelectorAll<HTMLElement>(':scope > * > section'));
    if (sections.length < 2 || width === 0) return;

    const left = width * 0.035;
    const right = width * 0.965;
    const sway = width * 0.012;
    const tops = sections.map((s) => s.getBoundingClientRect().top + window.scrollY - containerTop);

    // Start below the hero, end at the last section.
    let side = 0;
    let x = left;
    let y = tops[1] - 60;
    let d = `M ${x} ${y}`;

    for (let i = 2; i <= tops.length; i++) {
      const boundary = i < tops.length ? tops[i] : height - 80;
      const mid = (y + boundary) / 2;
      // Gentle sway along the margin…
      d += ` C ${x + sway} ${y + (mid - y) * 0.5}, ${x - sway} ${mid + (boundary - mid) * 0.3}, ${x} ${boundary - 140}`;
      if (i === tops.length) {
        d += ` L ${x} ${boundary}`;
        break;
      }
      // …then cross to the other margin through the padding between sections.
      side = 1 - side;
      const nextX = side ? right : left;
      d += ` C ${x} ${boundary - 40}, ${nextX} ${boundary + 40}, ${nextX} ${boundary + 140}`;
      x = nextX;
      y = boundary + 140;
    }

    const svg = this.svg().nativeElement;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    for (const path of [this.trace(), this.route(), this.reveal()]) {
      path.nativeElement.setAttribute('d', d);
    }

    const route = this.route().nativeElement;
    this.total = route.getTotalLength();
    const reveal = this.reveal().nativeElement;
    reveal.style.strokeDasharray = `${this.total} ${this.total}`;

    // Lookup table: the path always moves downwards, so y is monotonic.
    const steps = 600;
    this.samples = Array.from({ length: steps + 1 }, (_, i) => {
      const length = (this.total * i) / steps;
      const point = route.getPointAtLength(length);
      return { x: point.x, y: point.y, length };
    });
  }

  /** Draws the route up to the point level with the viewport and moves the bee there. */
  private update(container: HTMLElement): void {
    if (!this.samples.length) return;
    const containerTop = container.getBoundingClientRect().top + window.scrollY;
    const target = window.scrollY + window.innerHeight * 0.6 - containerTop;

    let lo = 0;
    let hi = this.samples.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.samples[mid].y < target) lo = mid + 1;
      else hi = mid;
    }
    const current = this.samples[lo];
    const previous = this.samples[Math.max(0, lo - 3)];

    this.reveal().nativeElement.style.strokeDashoffset = `${this.total - current.length}`;

    const bee = this.bee().nativeElement;
    const started = target > this.samples[0].y;
    bee.classList.toggle('is-visible', started && lo < this.samples.length - 1);
    const angle = (Math.atan2(current.y - previous.y, current.x - previous.x) * 180) / Math.PI + 90;
    bee.style.transform = `translate(${current.x}px, ${current.y}px) translate(-50%, -50%) rotate(${angle}deg)`;
  }
}
