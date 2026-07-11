'use client'

import AuthSidebar from '@/components/auth/AuthSidebar'
import InputField from '@/components/ui/InputField'
import PasswordField from '@/components/ui/PasswordField'
import { authApi } from '@/lib/api/auth'
import { SignUpFormData, signUpSchema } from '@/lib/validations/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { User } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function SignUpPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  })

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const response = await authApi.register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      })
      toast.success(response.message || "Account created successfully!");
      router.push('/login')
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      }
      else {
        toast.error('Something went wrong during registration.')
      }
    }
  }
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <AuthSidebar />

      {/* Right Side */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-3xl font-bold">Sign Up</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <InputField
              label="Fullname"
              icon={<User className="h-5 w-5" />}
              type="text"
              placeholder="Enter your Full Name"
              error={errors.fullName?.message}
              {...register('fullName')}
            />

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

            {/* Password */}
            <PasswordField
              placeholder="Re-enter your Password"
              label="Confirm Password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-5 w-full bg-[#1692EC] py-3 text-white"
            >
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </button>

            {/* Account */}
            <div className="w-full text-center">
              <p className="mt-5 text-sm">
                Already have an account?
                <Link
                  href="/login"
                  className="text-[#1692EC] hover:underline ml-2"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
