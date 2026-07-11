import RoleCard from '@/components/auth/RoleCard'
import { SquareUser, UserCog } from 'lucide-react'

export default function RoleSelectionPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F9FAFB]">
      {/* HEADER */}
      <header className="flex w-full items-center bg-white px-8 py-10">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded-full bg-[#0070A4]"></div>
          <span className="text-xl font-bold text-[#0070A4]">BRAND</span>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex flex-grow flex-col items-center justify-center px-4 py-12">
        {/* Title Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Select Access Level</h1>
          <p className="text-lg">
            Lorem ipsum dolor sit amet consectetur. Elit purus nam.
          </p>
        </div>

        {/* Cards Container */}
        <div className="grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 xl:gap-28">
          <RoleCard
            title="User"
            description="Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non"
            icon={<SquareUser className="h-16 w-16" />}
            href="/login?role=user"
            buttonText="Enter Workspace"
            variant="light"
          />

          <RoleCard
            title="Administrator"
            description="Lorem ipsum dolor sit amet consectetur. Elit purus nam gravida porttitor nibh urna sit ornare a. Proin dolor morbi id ornare aenean non"
            icon={<UserCog className="h-16 w-16" />}
            href="/login?role=admin"
            buttonText="Enter Portal"
            variant="dark"
          />
        </div>
      </main>
    </div>
  )
}
