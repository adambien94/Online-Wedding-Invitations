import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const InviteSchema = z.object({
  name: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email'),
  rsvp: z.enum(['yes', 'no', 'maybe']).optional(),
})

type InviteFormValues = z.infer<typeof InviteSchema>

export default function InviteForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<InviteFormValues>({
    resolver: zodResolver(InviteSchema),
    defaultValues: { rsvp: 'yes' as const },
  })

  const onSubmit = async (data: InviteFormValues) => {
    console.log('Submitted:', data)
    alert('Submitted — check console')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input {...register('name')} className="mt-1 block w-full border rounded px-3 py-2" />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Email</label>
        <input {...register('email')} className="mt-1 block w-full border rounded px-3 py-2" />
        {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">RSVP</label>
        <select {...register('rsvp')} className="mt-1 block w-full border rounded px-3 py-2">
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>

      <div>
        <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 bg-sky-600 text-white rounded">
          {isSubmitting ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
}
