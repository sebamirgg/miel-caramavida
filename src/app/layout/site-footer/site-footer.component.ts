import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../core/i18n/i18n.service';
import { NAV_ITEMS } from '../../data/sections.data';
import { PENDING_VALUE, SITE_CONFIG } from '../../data/site.config';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';
import { WaxSealComponent } from '../../shared/components/wax-seal/wax-seal.component';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink, LanguageSwitcherComponent, WaxSealComponent],
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  protected readonly t = inject(I18nService).t;
  protected readonly navItems = NAV_ITEMS;
  protected readonly contact = SITE_CONFIG.contact;
  protected readonly privacyUrl = SITE_CONFIG.privacyPolicyUrl;
  protected readonly pending = PENDING_VALUE;
  protected readonly year = new Date().getFullYear();
}
