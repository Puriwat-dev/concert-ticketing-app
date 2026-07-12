'use client'

import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import { Reservation, reservationsApi } from '@/lib/api/reservations'
import { useRole } from '@/lib/hooks/useRole'

export default function HistoryPage() {
  const { isAdmin, isRoleLoaded } = useRole()
  const [history, setHistory] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!isRoleLoaded) return

    let isMounted = true

    const fetchHistory = async () => {
      await Promise.resolve()

      try {
        setIsLoading(true)

        const data = isAdmin
          ? await reservationsApi.getAllReservations()
          : await reservationsApi.getUserHistory()

        if (isMounted) {
          setHistory(data)
        }
      } catch (error: unknown) {
        if (isMounted) {
          if (error instanceof Error) {
            if (!error.message.includes('403')) {
              toast.error(error.message)
            }
          } else {
            toast.error('Failed to load history.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchHistory()

    return () => {
      isMounted = false
    }
  }, [isAdmin, isRoleLoaded])

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString)
    const pad = (num: number) => num.toString().padStart(2, '0')

    const day = pad(date.getDate())
    const month = pad(date.getMonth() + 1)
    const year = date.getFullYear()
    const hours = pad(date.getHours())
    const minutes = pad(date.getMinutes())
    const seconds = pad(date.getSeconds())

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  return (
    <div className="rounded-md bg-white">
      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-[#1692EC]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-left text-sm text-black shadow-sm">
            <thead>
              <tr className="bg-white">
                <th className="border border-gray-300 p-4 font-bold">
                  Date time
                </th>
                <th className="border border-gray-300 p-4 font-bold">
                  Username
                </th>
                <th className="border border-gray-300 p-4 font-bold">
                  Concert name
                </th>
                <th className="border border-gray-300 p-4 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-300 p-8 text-center text-gray-500"
                  >
                    No reservation history found.
                  </td>
                </tr>
              ) : (
                history.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-4">
                      {formatDateTime(record.updatedAt)}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {record.user?.fullName || 'Unknown User'}
                    </td>
                    <td className="border border-gray-300 p-4">
                      {record.concert?.name || 'Unknown Concert'}
                    </td>
                    <td className="border border-gray-300 p-4 capitalize">
                      {record.action.toLowerCase()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
