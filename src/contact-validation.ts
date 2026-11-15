export const contactLimits = {
  nameMax: 80,
  emailMax: 254,
  messageMin: 30,
  messageMax: 2000,
};

export const contactFields = ['name', 'email', 'message'] as const;
export type ContactFields = Record<(typeof contactFields)[number], string>;
export type ContactErrors = Partial<ContactFields>;

export function validateContact(value: unknown): { data: ContactFields; errors: ContactErrors } {
  const input = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const data = {
    name: typeof input.name === 'string' ? input.name.trim() : '',
    email: typeof input.email === 'string' ? input.email.trim() : '',
    message: typeof input.message === 'string' ? input.message.trim() : '',
  };
  const errors: ContactErrors = {};
  if (!data.name || data.name.length > contactLimits.nameMax || /[\u0000-\u001f\u007f]/.test(data.name)) {
    errors.name = `Enter your name, using up to ${contactLimits.nameMax} characters.`;
  }
  if (data.email.length > contactLimits.emailMax || /[\u0000-\u001f\u007f]/.test(data.email)
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter an email address such as alex@example.com.';
  }
  if (data.message.length < contactLimits.messageMin || data.message.length > contactLimits.messageMax
    || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(data.message)) {
    errors.message = `Write between ${contactLimits.messageMin} and ${contactLimits.messageMax} characters about your space.`;
  }
  return { data, errors };
}
