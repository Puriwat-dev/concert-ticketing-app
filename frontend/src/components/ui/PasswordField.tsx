'use client'

import { Eye, EyeOff, LockKeyhole } from 'lucide-react'
import { useState } from 'react'

export default function PasswordField() {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="space-y-2">
      <label className="block">Password</label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3">
          <LockKeyhole className="h-5 w-5" />
        </div>

        <div
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </div>

        <input
          type={showPassword ? 'text' : 'password'}
          className="w-full rounded-md border border-gray-300 py-3 pl-10 pr-3 text-sm"
          placeholder="Enter your Password"
        />
      </div>
    </div>
  )
}
