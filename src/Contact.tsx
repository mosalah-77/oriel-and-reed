import { useEffect, useRef, useState, type FormEvent } from 'react';
import { contactFields, contactLimits, validateContact, type ContactErrors } from './contact-validation';

export default function Contact() {
  const form = useRef<HTMLFormElement>(null);
  const successHeading = useRef<HTMLHeadingElement>(null);
  const activeRequest = useRef<AbortController | null>(null);
  const attempt = useRef<{ payload: string; id: string } | null>(null);
  const [phase, setPhase] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<ContactErrors>({});
  const [failure, setFailure] = useState('');

  useEffect(() => () => {
    activeRequest.current?.abort();
    activeRequest.current = null;
  }, []);
  useEffect(() => {
    const first = contactFields.find(field => errors[field]);
    if (first) (form.current?.elements.namedItem(first) as HTMLElement | null)?.focus();
  }, [errors]);
  useEffect(() => {
    if (phase === 'success') successHeading.current?.focus();
  }, [phase]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (activeRequest.current) return;
    const { data, errors: fieldErrors } = validateContact(Object.fromEntries(new FormData(event.currentTarget)));
    setErrors(fieldErrors);
    setFailure('');
    if (Object.keys(fieldErrors).length) { setPhase('idle'); return; }

    const payload = JSON.stringify(data);
    if (attempt.current?.payload !== payload) attempt.current = { payload, id: crypto.randomUUID() };
    const id = attempt.current.id;
    const controller = new AbortController();
    activeRequest.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 10_000);
    setPhase('pending');
    try {
      const response = await fetch('/api/consultations', {
        method: 'POST', mode: 'same-origin', credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }), signal: controller.signal,
      });
      const result: unknown = await response.json();
      const body = result && typeof result === 'object' ? result as Record<string, unknown> : {};
      if (response.status === 400 && body.errors && typeof body.errors === 'object') {
        const serverErrors: ContactErrors = {};
        for (const field of contactFields) {
          const error = (body.errors as Record<string, unknown>)[field];
          if (typeof error === 'string') serverErrors[field] = error;
        }
        if (Object.keys(serverErrors).length) { setErrors(serverErrors); setPhase('idle'); return; }
      }
      if (response.status === 429) {
        setFailure('Too many test requests. Wait a minute, then try again.');
        setPhase('error');
        return;
      }
      if (!response.ok || body.status !== 'stored' || body.id !== id) throw new Error('Save was not confirmed.');
      setPhase('success');
    } catch {
      if (activeRequest.current !== controller) return;
      setFailure('We could not confirm that your test request was saved. Your details are still here. Please try again.');
      setPhase('error');
    } finally {
      window.clearTimeout(timeout);
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  }

  return (
    <section className="contact-page" aria-labelledby="contact-title">
      <div className="contact-intro">
        <h1 id="contact-title">Tell us about your space.</h1>
        <p>Start with the room you have in mind and what you would like to change. A few details are enough for a first conversation.</p>
        <div className="demo-note">
          <h2>Local demo</h2>
          <p>Use fictional details. Requests are saved on this computer for testing; email delivery is not connected.</p>
        </div>
      </div>
      {phase === 'success' ? (
        <div className="form-success">
          <h2 ref={successHeading} tabIndex={-1}>Test request saved.</h2>
          <p>The local test server saved your details. No email was sent and no appointment has been booked.</p>
          <a className="text-link" href="/projects">Explore the project concepts</a>
        </div>
      ) : (
        <form className="contact-form" ref={form} onSubmit={submit} noValidate aria-label="Consultation test request">
          <p className="form-note">All fields are required.</p>
          <fieldset disabled={phase === 'pending'}>
            <legend className="visually-hidden">Your consultation request</legend>
            <div className="contact-fields">
              <div className="form-field">
                <label htmlFor="contact-name">Your name</label>
                <input id="contact-name" name="name" autoComplete="name" required maxLength={contactLimits.nameMax}
                  aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />
                {errors.name && <p className="field-error" id="name-error">{errors.name}</p>}
              </div>
              <div className="form-field">
                <label htmlFor="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={contactLimits.emailMax}
                  aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} />
                {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="contact-message">About your space</label>
              <p className="field-hint" id="message-hint">Tell us about the room and the help you need. {contactLimits.messageMin}–{contactLimits.messageMax} characters.</p>
              <textarea id="contact-message" name="message" rows={6} required minLength={contactLimits.messageMin} maxLength={contactLimits.messageMax}
                aria-invalid={Boolean(errors.message)} aria-describedby={`message-hint${errors.message ? ' message-error' : ''}`} />
              {errors.message && <p className="field-error" id="message-error">{errors.message}</p>}
            </div>
            <button className="button-link" type="submit">{phase === 'pending' ? 'Saving…' : 'Save test request'}</button>
          </fieldset>
          <p className="form-status" role="status">{phase === 'pending' ? 'Saving your request to the local test server.' : ''}</p>
          {phase === 'error' && <p className="form-failure" role="alert">{failure}</p>}
        </form>
      )}
    </section>
  );
}
