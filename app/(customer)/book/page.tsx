'use client'

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { createBooking } from "@/lib/actions/booking.actions"

const TIME_SLOTS = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
    ]

    export default function BookPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const { data: session, status } = useSession()

    const serviceId = searchParams.get('serviceId') || ''
    const serviceName = searchParams.get('serviceName') || 'Service'

    const [selectedDate, setSelectedDate] = useState('')
    const [selectedSlot, setSelectedSlot] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const today = new Date().toISOString().split('T')[0]

    // Redirect to login if not logged in
    useEffect(() => {
        if (status === 'unauthenticated') {
        router.push('/login')
        }
    }, [status])

    const handleBook = async () => {
        if (!selectedDate || !selectedSlot) {
        setError('Please select a date and time slot!')
        return
        }

        if (!session?.user?.id) {
        router.push('/login')
        return
        }

        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('userId', session.user.id)
        formData.append('serviceId', serviceId)
        formData.append('date', selectedDate)
        formData.append('slot', selectedSlot)

        const result = await createBooking(null, formData)

        setLoading(false)

        if (result.error) {
        setError(result.error)
        } else {
        setSuccess('Booking confirmed! 🎉')
        setTimeout(() => router.push('/'), 1500)
        }
    }

    if (status === 'loading') {
        return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
            <p className="text-zinc-500">Loading...</p>
        </div>
        )
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">

        {/* Navbar */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center text-sm">
                ✂️
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">SalonBook</span>
            </div>
            <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white">
                Back to Services
            </Link>
            </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-10">

            <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Book Appointment
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Select your preferred date and time
            </p>
            </div>

            {/* Service Badge */}
            <div className="bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800 rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center text-sm">
                ✂️
            </div>
            <div>
                <p className="text-xs text-purple-600 dark:text-purple-400">Selected Service</p>
                <p className="font-semibold text-zinc-900 dark:text-white">{serviceName}</p>
            </div>
            </div>

            {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
            </div>
            )}
            {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                {success}
            </div>
            )}

            {/* Date Picker */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-4">
            <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">
                📅 Select Date
            </h2>
            <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => {
                setSelectedDate(e.target.value)
                setSelectedSlot('')
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
            </div>

            {/* Time Slots */}
            {selectedDate && (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 mb-6">
                <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">
                🕐 Select Time Slot
                </h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                    <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2 rounded-xl text-sm font-medium border transition-all
                        ${selectedSlot === slot
                        ? 'bg-purple-700 text-white border-purple-700'
                        : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:border-purple-400 dark:hover:border-purple-600'
                        }`}
                    >
                    {slot}
                    </button>
                ))}
                </div>
            </div>
            )}

            {/* Summary */}
            {selectedDate && selectedSlot && (
            <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 mb-6">
                <h2 className="font-semibold text-zinc-900 dark:text-white mb-3">
                📋 Booking Summary
                </h2>
                <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Service</span>
                    <span className="font-medium text-zinc-900 dark:text-white">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Date</span>
                    <span className="font-medium text-zinc-900 dark:text-white">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-zinc-500 dark:text-zinc-400">Time</span>
                    <span className="font-medium text-zinc-900 dark:text-white">{selectedSlot}</span>
                </div>
                </div>
            </div>
            )}

            <button
            onClick={handleBook}
            disabled={!selectedDate || !selectedSlot || loading}
            className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-purple-900/20"
            >
            {loading ? 'Booking...' : 'Confirm Booking'}
            </button>

        </div>
        </div>
    )
}