import LogoutButton from '@/components/ui/LogoutButton'
import { History, Home, RefreshCcw } from 'lucide-react'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="flex w-64 flex-col border-r border-gray-200 bg-white px-4 py-8">
        <h2 className="mb-8 px-4 text-3xl font-bold text-black">Admin</h2>

        <nav className="flex flex-1 flex-col space-y-2">
          {/* Active Link */}
          <Link
            href="/home"
            className="flex items-center gap-3 rounded-md bg-[#F0F5F9] px-4 py-3 font-medium text-black"
          >
            <Home className="h-5 w-5" />
            Home
          </Link>

          {/* Inactive Links */}
          <Link
            href="/history"
            className="flex items-center gap-3 rounded-md px-4 py-3 text-black hover:bg-gray-50"
          >
            <History className="h-5 w-5" />
            History
          </Link>

          <Link
            href="/login?role=user"
            className="flex items-center gap-3 rounded-md px-4 py-3 text-black hover:bg-gray-50"
          >
            <RefreshCcw className="h-5 w-5" />
            Switch to user
          </Link>
        </nav>

        {/* Logout at the bottom */}
        <LogoutButton />
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
