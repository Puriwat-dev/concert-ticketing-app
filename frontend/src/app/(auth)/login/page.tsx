'use client'

import AuthSidebar from '@/components/auth/AuthSidebar'
import InputField from '@/components/ui/InputField'
import PasswordField from '@/components/ui/PasswordField'
import { User } from 'lucide-react'
import Link from 'next/link'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

import { authApi } from '@/lib/api/auth'
import { LoginFormData, loginSchema } from '@/lib/validations/auth'
import { Suspense } from 'react'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const role = searchParams.get('role')
  const isAdmin = role === 'admin'
  const roleText = isAdmin ? 'Administrator' : 'User'

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await authApi.login({
        email: data.email,
        password: data.password,
      })

      localStorage.setItem('accessToken', response.accessToken)

      toast.success('Logged in successfully!')

      router.push('/home')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Invalid email or password.')
      }
    }
  }

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-10 text-center text-3xl font-bold">Login</h2>

      <form noValidate className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <InputField
          label="Email"
          icon={<User className="h-5 w-5" />}
          type="email"
          placeholder="Enter your Email Address"
          error={errors.email?.message}
          {...register('email')}
        />

        {/* Password */}
        <PasswordField
          error={errors.password?.message}
          {...register('password')}
        />

        {/* Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 w-full bg-[#1692EC] py-3 text-white"
        >
          {isSubmitting ? 'Logging in...' : `Login as ${roleText}`}
        </button>

        {/* Account */}
        <div className="w-full text-center">
          <p className="mt-5 text-sm">
            Don&apos;t have an account?
            <Link
              href="/signup"
              className="text-[#1692EC] hover:underline ml-2"
            >
              Create an account
            </Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <AuthSidebar />

      {/* Right Side */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <Suspense fallback={<div>Loading form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
