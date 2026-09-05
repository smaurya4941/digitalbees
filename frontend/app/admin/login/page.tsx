'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { ArrowRight, Hexagon, Lock, Mail } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { login } from '@/lib/admin/auth';
import { AdminApiError } from '@/lib/admin/http';
import { AdminButton, Field, TextInput } from '@/components/admin/ui';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-canvas" />}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const queryClient = useQueryClient();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { remember: true } });

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      const user = await login(values);
      queryClient.setQueryData(['auth', 'me'], user);
      const next = params.get('next');
      router.replace(next && next.startsWith('/admin') ? next : '/admin');
    } catch (error) {
      if (error instanceof AdminApiError) {
        if (error.status === 422) {
          const emailError = error.fieldError('email') ?? error.fieldError('password');
          if (emailError) setError('email', { message: emailError });
          setFormError(emailError ?? error.message);
        } else if (error.status === 429) {
          setFormError('Too many attempts. Please wait a minute and try again.');
        } else {
          setFormError('Something went wrong. Please try again.');
        }
      } else {
        setFormError('Cannot reach the server. Check your connection.');
      }
    }
  });

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-brand-navy-deep lg:block">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(200,162,74,0.5), transparent 45%), radial-gradient(circle at 80% 70%, rgba(59,89,152,0.4), transparent 40%)',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-brand-gold text-brand-navy-deep">
              <Hexagon className="size-5" strokeWidth={2.5} />
            </div>
            <span className="text-lg font-semibold text-white">Digital Bees</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md"
          >
            <h1 className="text-3xl font-semibold leading-tight text-white">
              The Content Studio for the entire Digital Bees website.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Manage practices, industries, case studies, media and SEO — everything
              that powers the public site — from one secure workspace.
            </p>
          </motion.div>

          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} The Digital Bees Corp. Authorized staff only.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-canvas px-6 py-12 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 lg:hidden">
            <div className="grid size-10 place-items-center rounded-xl bg-brand-navy text-white">
              <Hexagon className="size-5" strokeWidth={2.5} />
            </div>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-ink">Sign in</h2>
          <p className="mt-1.5 text-sm text-ink-muted">
            Use your Digital Bees staff account to continue.
          </p>

          {formError && (
            <div className="mt-5 rounded-xl border border-danger/20 bg-danger-surface/60 px-3.5 py-2.5 text-sm text-danger-strong">
              {formError}
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <Field label="Email" htmlFor="email" error={errors.email?.message} required>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
                <TextInput
                  id="email"
                  type="email"
                  autoComplete="username"
                  placeholder="you@digitalbees.in"
                  className="pl-10"
                  invalid={Boolean(errors.email)}
                  {...register('email')}
                />
              </div>
            </Field>

            <Field label="Password" htmlFor="password" error={errors.password?.message} required>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-ink-subtle" />
                <TextInput
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-10"
                  invalid={Boolean(errors.password)}
                  {...register('password')}
                />
              </div>
            </Field>

            <label className="flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                className="size-4 rounded border-hairline-strong text-brand-navy focus:ring-brand-navy/20"
                {...register('remember')}
              />
              Keep me signed in
            </label>

            <AdminButton type="submit" loading={isSubmitting} className="w-full" size="md">
              Sign in
              {!isSubmitting && <ArrowRight className="size-4" />}
            </AdminButton>
          </form>

          <p className="mt-6 text-center text-xs text-ink-subtle">
            Trouble signing in? Contact your administrator.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
