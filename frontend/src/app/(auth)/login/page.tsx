import PasswordField from '@/components/ui/PasswordField'
import { User } from 'lucide-react'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {

  const resolvedSearchParams = await searchParams;
  const isAdmin = resolvedSearchParams.role === 'admin'
  const roleText = isAdmin ? 'Administrator' : 'User'
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#0070A4] p-28 text-white md:flex">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-white"></div>
          <h1 className="ml-4 text-4xl font-semibold">Brand</h1>
        </div>

        <div>
          <div className="max-w-lg mb-8">
            <h1 className="font-semibold text-4xl">
              “Powering the tools that power the team.”
            </h1>
          </div>
          <p>
            Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida
            porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean
            non non
          </p>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex w-full items-center justify-center p-8 md:w-1/2">
        <div className="w-full max-w-md">
          <h2 className="mb-10 text-center text-3xl font-bold">Login</h2>

          <form className="space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label className="block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5" />
                </div>

                <input
                  type="email"
                  className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-sm"
                  placeholder="Enter your Email Address"
                />
              </div>
            </div>

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
                <a href="#" className="text-[#1692EC] hover:underline ml-2">
                  Create an account
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
