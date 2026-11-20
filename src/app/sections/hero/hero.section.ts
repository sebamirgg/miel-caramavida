import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { MEDIA } from '../../data/media.data';
import { SECTION_IDS } from '../../data/sections.data';
import { CtaLinkComponent } from '../../shared/components/cta-link/cta-link.component';
import { MediaPlaceholderComponent } from '../../shared/components/media-placeholder/media-placeholder.component';

@Component({
  selector: 'app-hero-section',
  imports: [CtaLinkComponent, MediaPlaceholderComponent],
  templateUrl: './hero.section.html',
  styleUrl: './hero.section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSection {
  protected readonly t = inject(I18nService).t;
  protected readonly id = SECTION_IDS.home;
  protected readonly media = MEDIA.hero;

  private readonly video = viewChild<ElementRef<HTMLVideoElement>>('video');

  constructor() {
    // The background video (muted, no audio) only plays when motion is allowed.
    afterNextRender(() => {
      const video = this.video()?.nativeElement;
      if (video && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        video.play().catch(() => undefined);
      }
    });
  }
}
