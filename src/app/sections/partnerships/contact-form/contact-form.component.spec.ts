import { TestBed } from '@angular/core/testing';
import { ContactService } from '../../../core/services/contact.service';
import { ContactFormComponent } from './contact-form.component';

describe('ContactFormComponent', () => {
  const submit = vi.fn().mockResolvedValue({ ok: true });

  beforeEach(async () => {
    submit.mockClear();
    await TestBed.configureTestingModule({
      imports: [ContactFormComponent],
      providers: [{ provide: ContactService, useValue: { submit, buildMailtoLink: () => null } }],
    }).compileComponents();
  });

  function setup() {
    const fixture = TestBed.createComponent(ContactFormComponent);
    fixture.detectChanges();
    return { fixture, form: fixture.componentInstance.form, el: fixture.nativeElement as HTMLElement };
  }

  function fillValid(form: ContactFormComponent['form']) {
    form.setValue({
      inquiryType: 'dossier',
      name: 'Ana Pérez',
      company: 'Honig GmbH',
      country: 'Alemania',
      email: 'ana@honig.de',
      businessType: 'importer',
      interest: 'both',
      volume: '',
      message: 'Nos interesa recibir el dossier comercial.',
      consent: true,
      website: '',
    });
  }

  it('requires privacy consent', () => {
    const { form } = setup();
    fillValid(form);
    form.controls.consent.setValue(false);
    expect(form.invalid).toBe(true);
  });

  it('rejects free email providers', () => {
    const { form } = setup();
    form.controls.email.setValue('ana@gmail.com');
    expect(form.controls.email.hasError('corporateEmail')).toBe(true);
  });

  it('shows accessible errors and does not submit an invalid form', async () => {
    const { fixture, el } = setup();
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(submit).not.toHaveBeenCalled();
    expect(el.querySelector('[role="alert"]')).not.toBeNull();
    const name = el.querySelector('#cf-name')!;
    expect(name.getAttribute('aria-invalid')).toBe('true');
    expect(name.getAttribute('aria-describedby')).toBe('cf-name-error');
  });

  it('submits a valid form through ContactService and shows confirmation', async () => {
    const { fixture, form, el } = setup();
    fillValid(form);
    el.querySelector('form')!.dispatchEvent(new Event('submit'));
    await fixture.whenStable();
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'ana@honig.de', interest: 'both', volume: null, consent: true }),
    );
    expect(el.querySelector('#cf-success-title')).not.toBeNull();
  });
});
