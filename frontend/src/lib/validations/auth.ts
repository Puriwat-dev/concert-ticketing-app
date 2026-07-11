import { z } from 'zod'

export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { error: 'Full name must be at least 2 characters' }),

    email: z.email({ error: 'Please enter a valid email address' }),

    password: z
      .string()
      .min(6, { error: 'Password must be at least 6 characters long' }),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.email({ error: 'Please enter a valid email address' }),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export type SignUpFormData = z.infer<typeof signUpSchema>
