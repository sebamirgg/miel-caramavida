import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { I18nService } from '../../../core/i18n/i18n.service';
import { LANG_META, SUPPORTED_LANGS } from '../../../core/i18n/i18n.types';

let nextId = 0;

/**
 * Language selector.
 * - `menu` (header): disclosure button showing the current language. Opens a
 *   list of links; Arrow keys / Home / End move between options, Escape closes
 *   and returns focus, clicking or tabbing outside closes it.
 * - `list` (footer): every language visible as plain links.
 * Each option is written in its own language and script, with matching `lang`.
 */
@Component({
  selector: 'app-language-switcher',
  imports: [RouterLink, NgTemplateOutlet],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"is-" + variant()',
    '(document:click)': 'onDocumentClick($event)',
    '(keydown)': 'onKeydown($event)',
    '(focusout)': 'onFocusOut($event)',
  },
})
export class LanguageSwitcherComponent {
  protected readonly i18n = inject(I18nService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);

  readonly variant = input<'menu' | 'list'>('menu');
  readonly changed = output<void>();

  protected readonly open = signal(false);
  protected readonly panelId = `lang-panel-${nextId++}`;
  private readonly trigger = viewChild<ElementRef<HTMLButtonElement>>('trigger');

  protected readonly languages = SUPPORTED_LANGS.map((code) => ({
    code,
    htmlLang: LANG_META[code].htmlLang,
    name: this.i18n.dictionary(code).language.name,
  }));

  protected readonly current = computed(
    () => this.languages.find((l) => l.code === this.i18n.lang()) ?? this.languages[0],
  );

  protected toggle(): void {
    this.open.update((open) => !open);
  }

  protected select(): void {
    this.close(false);
    this.changed.emit();
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) this.close(false);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (this.open() && next && !this.host.nativeElement.contains(next)) this.close(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.variant() !== 'menu') return;
    const links = this.optionLinks();
    const index = links.indexOf(this.host.nativeElement.ownerDocument.activeElement as HTMLAnchorElement);

    switch (event.key) {
      case 'Escape':
        if (this.open()) {
          event.stopPropagation();
          this.close(true);
        }
        return;
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const step = event.key === 'ArrowDown' ? 1 : -1;
        if (!this.open()) {
          this.openAndFocus(step === 1 ? 0 : -1);
        } else {
          const target = index === -1 ? 0 : (index + step + links.length) % links.length;
          links[target]?.focus();
        }
        return;
      }
      case 'Home':
      case 'End':
        if (this.open() && index !== -1) {
          event.preventDefault();
          links[event.key === 'Home' ? 0 : links.length - 1]?.focus();
        }
        return;
    }
  }

  private openAndFocus(position: number): void {
    this.open.set(true);
    afterNextRender(
      () => {
        const links = this.optionLinks();
        links[position < 0 ? links.length - 1 : position]?.focus();
      },
      { injector: this.injector },
    );
  }

  private close(returnFocus: boolean): void {
    this.open.set(false);
    if (returnFocus) this.trigger()?.nativeElement.focus();
  }

  private optionLinks(): HTMLAnchorElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLAnchorElement>('.lang__option'));
  }
}
