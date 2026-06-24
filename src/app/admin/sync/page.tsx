import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { triggerSync } from '@/lib/api-client';
import Button from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import ErrorBoundary from '@/components/ui/error-boundary';

/**
 * Validation schema for the sync confirmation form.
 * The user must type the exact word "SYNC" (case‑sensitive) to enable the action.
 */
const schema = z.object({
  confirm: z
    .string()
    .refine((val) => val === 'SYNC', {
      message: 'Please type exactly SYNC to confirm.'
    })
});

type FormData = z.infer<typeof schema>;

/**
 * Admin page that allows an authorized user to trigger a data sync.
 * The sync operation is delegated to the backend via the `triggerSync` API client.
 *
 * The component provides:
 *   • Form validation using Zod + React Hook Form
 *   • Toast notifications for loading / success / error states
 *   • Graceful error handling with an accessible error message area
 */
export default function SyncPage(): JSX.Element {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit = async (data: FormData) => {
    setApiError(null);
    try {
      // `toast.promise` automatically handles loading / success / error UI.
      await toast.promise(
        triggerSync(),
        {
          loading: 'Triggering sync…',
          success: 'Sync triggered successfully!',
          error: (err) => {
            const msg = err instanceof Error ? err.message : 'Failed to trigger sync.';
            setApiError(msg);
            return msg;
          }
        }
      );
      // Reset the form after a successful trigger so the user can trigger again if needed.
      reset();
    } catch (err) {
      // This catch block handles unexpected errors that escape toast.promise.
      const message = err instanceof Error ? err.message : 'Unexpected error occurred.';
      setApiError(message);
      console.error('Sync error:', err);
    }
  };

  return (
    <ErrorBoundary>
      <section className="max-w-xl mx-auto p-6 border rounded-lg bg-white shadow-sm">
        <h1 className="text-xl font-semibold mb-4">Admin: Trigger Data Sync</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <p className="text-sm text-gray-600">
            Type <strong>SYNC</strong> to confirm you want to start a new ingestion and summarization cycle.
          </p>
          <input
            {...register('confirm')}
            className={`border p-2 w-full rounded ${errors.confirm ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter SYNC to confirm"
            aria-label="Sync confirmation input"
            aria-invalid={errors.confirm ? 'true' : 'false'}
          />
          {errors.confirm && (
            <p className="text-red-600 text-sm" role="alert">
              {errors.confirm.message?.toString()}
            </p>
          )}
          {apiError && (
            <p className="text-red-600 text-sm" role="alert" aria-live="assertive">
              {apiError}
            </p>
          )}
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Trigger Sync
          </Button>
        </form>
      </section>
    </ErrorBoundary>
  );
}
