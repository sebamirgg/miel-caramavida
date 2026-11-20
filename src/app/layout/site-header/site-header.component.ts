import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { NAV_ITEMS, SECTION_IDS } from '../../data/sections.data';
import { CtaLinkComponent } from '../../shared/components/cta-link/cta-link.component';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, CtaLinkComponent, LanguageSwitcherComponent],
  templateUrl: './site-header.component.html',
  styleUrl: './site-header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '(document:keydown.escape)': 'onEscape()' },
})
export class SiteHeaderComponent {
  protected readonly t = inject(I18nService).t;
  protected readonly navItems = NAV_ITEMS;
  protected readonly homeFragment = SECTION_IDS.home;
  protected readonly menuOpen = signal(false);

  private readonly toggleButton = viewChild<ElementRef<HTMLButtonElement>>('toggle');

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    this.toggleButton()?.nativeElement.focus();
  }
}
