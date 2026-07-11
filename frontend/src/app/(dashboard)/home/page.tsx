'use client'

import ConcertCard from '@/components/ui/ConcertCard'
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal'
import StatCard from '@/components/ui/StatCard'
import { concertsApi, type Concert } from '@/lib/api/concerts'
import { reservationsApi } from '@/lib/api/reservations'
import { useRole } from '@/lib/hooks/useRole'
import {
  createConcertSchema,
  type CreateConcertFormData,
} from '@/lib/validations/concerts'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Award,
  Loader2,
  Save,
  User,
  User as UserIcon,
  XCircle,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export default function HomePage() {
  const { isAdmin } = useRole()

  const [activeTab, setActiveTab] = useState<'overview' | 'create'>('overview')
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [reserveCount, setReserveCount] = useState(0)
  const [cancelCount, setCancelCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [concertToDelete, setConcertToDelete] = useState<Concert | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateConcertFormData>({
    resolver: zodResolver(createConcertSchema),
    defaultValues: {
      name: '',
      description: '',
      totalSeats: 500,
    },
  })

  const totalConcertSeats = useMemo(() => {
    return concerts.reduce((sum, concert) => sum + concert.totalSeats, 0);
  }, [concerts]);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const concertsData = await concertsApi.getAll()
      setConcerts(concertsData)

      if (isAdmin) {
        const reservationsData = await reservationsApi.getAllReservations()

        const reserves = reservationsData.filter(
          (r) => r.action.toUpperCase() === 'RESERVE',
        ).length
        const cancels = reservationsData.filter(
          (r) => r.action.toUpperCase() === 'CANCEL',
        ).length

        setReserveCount(reserves)
        setCancelCount(cancels)
      }
    } catch (error: unknown) {
      if (error instanceof Error && !error.message.includes('403')) {
        toast.error(error.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [isAdmin])

  useEffect(() => {
    let isMounted = true
    const loadData = async () => {
      await Promise.resolve()
      if (isMounted) {
        fetchDashboardData()
      }
    }
    loadData()
    return () => {
      isMounted = false
    }
  }, [fetchDashboardData])

  const fetchConcerts = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await concertsApi.getAll()
      setConcerts(data)
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      await Promise.resolve()
      if (isMounted) {
        fetchConcerts()
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [fetchConcerts])

  const onSubmit = async (data: CreateConcertFormData) => {
    try {
      await concertsApi.create(data)
      toast.success('Concert created successfully!')

      reset()
      setActiveTab('overview')
      fetchConcerts()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to create concert')
      }
    }
  }

  const handleDeleteConfirm = async () => {
    if (!concertToDelete) return

    setIsDeleting(true)
    try {
      await concertsApi.delete(concertToDelete.id)
      toast.success('Concert deleted successfully')

      fetchConcerts()
      setConcertToDelete(null)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Failed to delete concert')
      }
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* STATS CARDS */}
      {isAdmin && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <StatCard
            icon={<User className="mb-2 h-8 w-8" />}
            label="Total of seats"
            value={totalConcertSeats}
            bgColorClass="bg-[#0070A4]"
          />
          <StatCard
            icon={<Award className="mb-2 h-8 w-8" />}
            label="Reserve"
            value={reserveCount}
            bgColorClass="bg-[#00A58B]"
          />
          <StatCard
            icon={<XCircle className="mb-2 h-8 w-8" />}
            label="Cancel"
            value={cancelCount}
            bgColorClass="bg-[#F96464]"
          />
        </div>
      )}

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 text-lg">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 ${
            activeTab === 'overview'
              ? 'border-b-2 border-[#1692EC] font-medium text-[#1692EC]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Overview
        </button>
        {isAdmin && (
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-3 ${
              activeTab === 'create'
                ? 'border-b-2 border-[#1692EC] font-medium text-[#1692EC]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Create
          </button>
        )}
      </div>

      {/* TAB CONTENT RENDERER */}
      {activeTab === 'overview' ? (
        /* OVERVIEW TAB CONTENT */
        <div className="flex flex-col gap-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-[#1692EC]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : concerts.length === 0 ? (
            <div className="rounded-md border border-gray-200 bg-white p-12 text-center text-gray-500">
              No concerts found. Click &quot;Create&quot; to add one!
            </div>
          ) : (
            /* 4. Map over the real data */
            concerts.map((concert) => (
              <ConcertCard
                key={concert.id}
                name={concert.name}
                description={concert.description}
                totalSeats={concert.totalSeats}
                onDelete={
                  isAdmin ? () => setConcertToDelete(concert) : undefined
                }
              />
            ))
          )}
        </div>
      ) : (
        /* CREATE TAB CONTENT */
        <div className="rounded-md border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-3xl font-bold text-[#1692EC]">Create</h3>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-lg">Concert Name</label>
                <input
                  type="text"
                  placeholder="Please input concert name"
                  className={`w-full rounded-md border p-3 text-sm focus:outline-none ${
                    errors.name
                      ? 'border-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  {...register('name')}
                />
                {errors.name && (
                  <p className="text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-lg">Total of seat</label>
                <div className="relative">
                  <input
                    type="number"
                    className={`w-full rounded-md border p-3 pr-10 text-sm focus:outline-none ${
                      errors.totalSeats
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:border-blue-500'
                    }`}
                    {...register('totalSeats', {
                      setValueAs: (value) => {
                        if (value === '') return undefined
                        const parsed = Number(value)
                        return isNaN(parsed) ? undefined : parsed
                      },
                    })}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>
                {errors.totalSeats && (
                  <p className="text-xs text-red-500">
                    {errors.totalSeats.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Description</label>
              <textarea
                rows={4}
                placeholder="Please input description"
                className={`w-full resize-none rounded-md border p-3 text-sm focus:outline-none ${
                  errors.description
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-gray-300 focus:border-blue-500'
                }`}
                {...register('description')}
              ></textarea>
              {errors.description && (
                <p className="text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-md bg-[#1692EC] px-8 py-3 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Save className="h-5 w-5" />
                )}
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
            </div>
          </form>
        </div>
      )}
      {concertToDelete && (
        <DeleteConfirmModal
          concertName={concertToDelete.name}
          isDeleting={isDeleting}
          onCancel={() => setConcertToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  )
}
