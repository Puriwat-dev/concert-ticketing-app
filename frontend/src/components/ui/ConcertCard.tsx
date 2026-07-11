import { Trash2, User } from 'lucide-react'

interface ConcertCardProps {
  name: string
  description: string
  totalSeats: number
  onDelete?: () => void
}

export default function ConcertCard({
  name,
  description,
  totalSeats,
  onDelete,
}: ConcertCardProps) {
  return (
    <div className="flex flex-col rounded-md border border-gray-200 bg-white p-6 shadow-sm">
      {/* Title */}
      <h3 className="mb-4 text-2xl font-bold text-[#1692EC]">{name}</h3>

      {/* Divider */}
      <hr className="mb-4 border-gray-200" />

      {/* Description */}
      <p className="mb-8 text-base text-black">{description}</p>

      {/* Bottom Row */}
      <div className="mt-auto flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg text-black">
          <User className="h-5 w-5" />
          <span>{totalSeats}</span>
        </div>

        {onDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-2 rounded-md bg-[#F96464] px-6 py-2.5 text-white transition-colors hover:bg-red-600"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        )}
      </div>
    </div>
  )
}
