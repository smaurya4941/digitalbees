import { z } from 'zod';

/** Job application form (blueprint §28.2). Mirrors the backend ApplyToJobRequest. */
export const applicationSchema = z.object({
  fullName: z.string().trim().min(1, 'Enter your name.').max(150),
  email: z.string().trim().min(1, 'Enter your email.').email('Enter a valid email address.').max(150),
  phone: z.string().trim().max(50).optional().or(z.literal('')),
  coverNote: z.string().trim().max(5000, 'Keep this under 5,000 characters.').optional().or(z.literal('')),
  companyWebsite: z.literal('').optional(), // honeypot
});

export type ApplicationValues = z.infer<typeof applicationSchema>;

export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_EXTENSIONS = ['pdf', 'doc', 'docx'] as const;

/** Client-side mirror of the server's `mimes:pdf,doc,docx|max:5120` rule. Returns an error message or null. */
export function validateResumeFile(file: File): string | null {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!(RESUME_EXTENSIONS as readonly string[]).includes(extension)) {
    return 'Upload a PDF, DOC or DOCX file.';
  }
  if (file.size > RESUME_MAX_BYTES) {
    return 'That file is over 5MB. Please upload a smaller version.';
  }
  return null;
}
