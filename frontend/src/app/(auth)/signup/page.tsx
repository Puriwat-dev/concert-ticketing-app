import InputField from '@/components/ui/InputField'
import PasswordField from '@/components/ui/PasswordField'
import { User } from 'lucide-react'
import Link from 'next/link'

export default async function SignUpPage() {
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
          <h2 className="mb-10 text-center text-3xl font-bold">Sign Up</h2>

          <form className="space-y-6">
            {/* Full Name */}
            <InputField
              label="Fullname"
              icon={<User className="h-5 w-5" />}
              type="text"
              placeholder="Enter your Full Name"
            />
  
            {/* Email */}
            <InputField
              label="Email"
              icon={<User className="h-5 w-5" />}
              type="email"
              placeholder="Enter your Email Address"
            />

            {/* Password */}
            <PasswordField />

            {/* Password */}
            <PasswordField placeholder='Re-enter your Password' label='Confirm Password'/>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="mt-5 w-full bg-[#1692EC] py-3 text-white"
            >
              Sign Up
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
