import { DestroyRef, Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/**
 * Subtle fade/translate when an element scrolls into view.
 *
 * Progressive enhancement: content is visible in the server-rendered HTML;
 * only elements that start below the fold are hidden, once JS runs in the
 * browser. Disabled when the user prefers reduced motion.
 */
@Directive({ selector: '[appReveal]' })
export class RevealDirective {
  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (
        typeof IntersectionObserver === 'undefined' ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        element.getBoundingClientRect().top < window.innerHeight * 0.9
      ) {
        return;
      }

      element.classList.add('reveal-pending');
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            element.classList.replace('reveal-pending', 'reveal-in');
            observer.disconnect();
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
      );
      observer.observe(element);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
