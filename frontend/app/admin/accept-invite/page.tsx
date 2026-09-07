'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { acceptInvitation, getInvitation } from '@/lib/admin/users';
import { AdminApiError } from '@/lib/admin/http';
import { AdminButton, Field, TextInput } from '@/components/admin/ui';

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={null}>
      <AcceptInviteForm />
    </Suspense>
  );
}

function AcceptInviteForm() {
  const router = useRouter();
  const token = useSearchParams().get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const invite = useQuery({
    queryKey: ['invitation', token],
    queryFn: ({ signal }) => getInvitation(token, signal),
    enabled: token.length > 0,
    retry: false,
  });

  const mutation = useMutation({
    mutationFn: () =>
      acceptInvitation({ token, password, password_confirmation: confirm }),
    onSuccess: () => router.replace('/admin/login?invited=1'),
    onError: (error) => {
      if (error instanceof AdminApiError) {
        setFormError(error.fieldError('password') ?? error.message);
      } else {
        setFormError('Something went wrong. Try again.');
      }
    },
  });

  const invalid = !token || invite.isError;

  return (
    <div className="grid min-h-dvh place-items-center bg-canvas-sunken px-4">
      <div className="w-full max-w-sm rounded-2xl border border-hairline bg-white p-8 shadow-lg">
        <h1 className="text-lg font-semibold text-ink">Set your password</h1>

        {invalid ? (
          <>
            <p className="mt-2 text-sm text-ink-muted">
              This invitation link is invalid or has expired. Ask an administrator to send a new one.
            </p>
            <Link
              href="/admin/login"
              className="mt-4 inline-block text-sm font-medium text-brand-navy hover:underline"
            >
              Go to sign in
            </Link>
          </>
        ) : (
          <>
            {invite.data && (
              <p className="mt-1 text-sm text-ink-muted">
                Welcome, {invite.data.name}. Choose a password for {invite.data.email}.
              </p>
            )}
            <form
              className="mt-5 space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setFormError(null);
                if (password !== confirm) {
                  setFormError('Passwords do not match.');
                  return;
                }
                mutation.mutate();
              }}
            >
              <Field label="Password" error={formError ?? undefined}>
                <TextInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </Field>
              <Field label="Confirm password" hint="At least 10 characters, with a letter and a number.">
                <TextInput
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </Field>
              <AdminButton type="submit" className="w-full" loading={mutation.isPending}>
                Set password &amp; sign in
              </AdminButton>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
