'use client';

import { useRouter } from 'next/navigation';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminApiError } from '@/lib/admin/http';
import {
  type AdminLocation,
  createLocation,
  listLocations,
  locationQueryKeys,
  updateLocation,
} from '@/lib/admin/locations';
import { useAuth } from './providers';
import { AdminButton, Field, Panel, Select, Textarea, TextInput, useToast } from './ui';

const schema = z.object({
  region_id: z.string().min(1, 'Choose a region'),
  name: z.string().min(1, 'Name is required').max(150),
  slug: z
    .string()
    .max(255)
    .regex(/^[a-z0-9-]*$/, 'Lowercase letters, numbers and hyphens only')
    .optional(),
  address: z.string().max(2000).optional(),
  city: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  lat: z.string().optional().refine((v) => !v || !Number.isNaN(Number(v)), 'Must be a number'),
  lng: z.string().optional().refine((v) => !v || !Number.isNaN(Number(v)), 'Must be a number'),
  status: z.enum(['draft', 'published']),
});

type FormValues = z.infer<typeof schema>;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function LocationForm({ location }: { location?: AdminLocation }) {
  const isEdit = Boolean(location);
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const { can } = useAuth();
  const canPublish = can('content.publish');

  const { data: listData } = useQuery({
    queryKey: locationQueryKeys.list({}),
    queryFn: ({ signal }) => listLocations({}, signal),
  });
  const regions = listData?.meta.regions ?? [];

  const {
    register,
    handleSubmit,
    setError,
    control,
    setValue,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      region_id: location?.region_id ? String(location.region_id) : '',
      name: location?.name ?? '',
      slug: location?.slug ?? '',
      address: location?.address ?? '',
      city: location?.city ?? '',
      country: location?.country ?? '',
      lat: location?.lat != null ? String(location.lat) : '',
      lng: location?.lng != null ? String(location.lng) : '',
      status: location?.status === 'published' ? 'published' : 'draft',
    },
  });

  const cityValue = useWatch({ control, name: 'city' }) ?? '';
  const slugValue = useWatch({ control, name: 'slug' }) ?? '';

  const mutation = useMutation({
    mutationFn: (values: FormValues) => {
      const payload = {
        region_id: Number(values.region_id),
        name: values.name,
        slug: values.slug || slugify(values.city || values.name),
        address: values.address || null,
        city: values.city || null,
        country: values.country || null,
        lat: values.lat ? Number(values.lat) : null,
        lng: values.lng ? Number(values.lng) : null,
        status: values.status,
      };
      return isEdit ? updateLocation(location!.slug, payload) : createLocation(payload);
    },
    onSuccess: (saved) => {
      toast.success(isEdit ? 'Changes saved.' : `“${saved.name}” created.`);
      void queryClient.invalidateQueries({ queryKey: locationQueryKeys.all });
      router.push('/admin/locations');
    },
    onError: (error) => {
      if (error instanceof AdminApiError && error.status === 422) {
        for (const [field, messages] of Object.entries(error.errors)) {
          setError(field as keyof FormValues, { message: messages[0] });
        }
        toast.error('Please fix the highlighted fields.');
      } else if (error instanceof AdminApiError && error.isForbidden) {
        toast.error(error.message || 'You do not have permission for this action.');
      } else {
        toast.error('Could not save the office.');
      }
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  return (
    <form onSubmit={onSubmit} className="space-y-6" noValidate>
      <Panel className="space-y-5 p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Region" htmlFor="region_id" error={errors.region_id?.message} required>
            <Select id="region_id" {...register('region_id')}>
              <option value="">Select a region</option>
              {regions.map((r) => (
                <option key={r.id} value={String(r.id)}>
                  {r.name}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Name" htmlFor="name" error={errors.name?.message} required>
            <TextInput id="name" invalid={Boolean(errors.name)} {...register('name')} />
          </Field>
          <Field label="City" htmlFor="city" error={errors.city?.message}>
            <TextInput
              id="city"
              {...register('city', {
                onChange: (e) => {
                  if (!isEdit && (!slugValue || slugValue === slugify(cityValue))) {
                    setValue('slug', slugify(e.target.value));
                  }
                },
              })}
            />
          </Field>
          <Field label="Country" htmlFor="country" error={errors.country?.message}>
            <TextInput id="country" {...register('country')} />
          </Field>
          <Field
            label="Slug"
            htmlFor="slug"
            error={errors.slug?.message}
            hint={`Public URL: /locations/${slugValue || slugify(cityValue) || 'office'}`}
          >
            <TextInput id="slug" invalid={Boolean(errors.slug)} {...register('slug')} />
          </Field>
          <Field
            label="Status"
            htmlFor="status"
            error={errors.status?.message}
            hint={canPublish ? undefined : 'Publishing needs the content.publish permission.'}
          >
            <Select id="status" {...register('status')}>
              <option value="draft">Draft</option>
              <option value="published" disabled={!canPublish}>
                Published
              </option>
            </Select>
          </Field>
        </div>
        <Field label="Address" htmlFor="address" error={errors.address?.message}>
          <Textarea id="address" rows={3} {...register('address')} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Latitude" htmlFor="lat" error={errors.lat?.message}>
            <TextInput id="lat" {...register('lat')} placeholder="51.5072" />
          </Field>
          <Field label="Longitude" htmlFor="lng" error={errors.lng?.message}>
            <TextInput id="lng" {...register('lng')} placeholder="-0.1276" />
          </Field>
        </div>
      </Panel>

      <div className="flex items-center justify-end gap-3">
        <AdminButton type="button" variant="ghost" onClick={() => router.push('/admin/locations')}>
          Cancel
        </AdminButton>
        <AdminButton type="submit" loading={isSubmitting || mutation.isPending} disabled={isEdit && !isDirty}>
          {isEdit ? 'Save changes' : 'Create office'}
        </AdminButton>
      </div>
    </form>
  );
}
