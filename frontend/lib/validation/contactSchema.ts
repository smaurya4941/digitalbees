import { z } from 'zod';

/**
 * Validates every persona variant of the contact form (blueprint §26.4 /
 * §28.1). `companyWebsite` is the honeypot — a real visitor never sees or
 * fills it; the backend rejects the submission outright (422) if it's set,
 * so this schema requires it to stay empty rather than merely optional.
 */
export const contactSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter your name.').max(150),
  email: z.string().trim().min(1, 'Enter your email.').email('Enter a valid email address.').max(150),
  company: z.string().trim().max(150).optional().or(z.literal('')),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  message: z.string().trim().max(5000).optional().or(z.literal('')),
  practiceSlug: z.string().optional().or(z.literal('')),
  regionSlug: z.string().optional().or(z.literal('')),
  companyWebsite: z.literal('').optional(),
});

export type ContactFormValues = z.infer<typeof contactSchema>;

/** Press enquiries must name the outlet — the form labels the field as required. */
export const pressContactSchema = contactSchema.extend({
  company: z.string().trim().min(1, 'Enter the publication or outlet.').max(150),
});
