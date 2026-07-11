import AuthSidebar from '@/components/auth/AuthSidebar'
import InputField from '@/components/ui/InputField'
import PasswordField from '@/components/ui/PasswordField'
import { User } from 'lucide-react'
import Link from 'next/link'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const isAdmin = resolvedSearchParams.role === 'admin'
  const roleText = isAdmin ? 'Administrator' : 'User'
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <AuthSidebar/>

      {/* Right Side */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-3xl font-bold">Login</h2>

          <form className="space-y-6">
            {/* Email */}
            <InputField
              label="Email"
              icon={<User className="h-5 w-5" />}
              type="email"
              placeholder="Enter your Email Address"
            />

            {/* Password */}
            <PasswordField />

            {/* Login Button */}
            <button
              type="submit"
              className="mt-5 w-full bg-[#1692EC] py-3 text-white"
            >
              Login as {roleText}
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
      </div>
    </div>
  )
}
