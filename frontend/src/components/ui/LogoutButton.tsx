'use client'

import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = () => {
    document.cookie =
      'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax'

    toast.success('Logged out successfully')

    router.push('/')
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-auto flex items-center gap-3 px-4 py-3"
    >
      <LogOut className="h-5 w-5" />
      Logout
    </button>
  )
}
