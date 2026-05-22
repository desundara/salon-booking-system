'use client'

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { LogOut, Calendar, ChevronDown } from "lucide-react"

type Booking = {
    id: string
    date: Date
    slot: string
    status: string
    service: { name: string; price: number; duration: number }
    }

    export default function MyBookingsClient({
    bookings,
    userName,
    }: {
    bookings: Booking[]
    userName: string
    }) {
    const { data: session } = useSession()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setDropdownOpen(false)
        }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const statusColor = (status: string) => {
        if (status === 'CONFIRMED') return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
        if (status === 'CANCELLED') return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
        return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black">

        {/* Navbar */}
        <nav className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-700 rounded-lg flex items-center justify-center text-sm">
                ✂️
            </div>
            <span className="font-bold text-zinc-900 dark:text-white">SalonBook</span>
            </Link>

            <div className="flex items-center gap-3">
            <ThemeToggle />

            {session && (
                <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all"
                >
                    <div className="w-7 h-7 bg-purple-700 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-semibold">
                        {session.user?.name?.charAt(0).toUpperCase()}
                    </span>
                    </div>
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 max-w-[100px] truncate">
                    {/* {session.user?.name} */}
                    </span>
                    <ChevronDown className={`h-3.5 w-3.5 text-zinc-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">Signed in as</p>
                        <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">{session.user?.email}</p>
                    </div>
                    <div className="py-1">
                        <Link
                        href="/my-bookings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                        >
                        <Calendar className="h-4 w-4 text-zinc-500" />
                        My Bookings
                        </Link>
                        <button
                        onClick={() => signOut({ callbackUrl: '/login' })}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                        >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                        </button>
                    </div>
                    </div>
                )}
                </div>
            )}
            </div>
        </nav>

        <div className="max-w-4xl mx-auto px-6 py-10">

            {/* Header */}
            <div className="mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                My Bookings
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Welcome, {userName}!
            </p>
            </div>

            {bookings.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <div className="text-4xl mb-4">📅</div>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">No bookings yet</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-6">Book your first appointment today!</p>
                <Link
                href="/"
                className="text-sm bg-purple-700 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl transition-all"
                >
                Browse Services
                </Link>
            </div>
            ) : (
            <div className="grid gap-4">
                {bookings.map((booking) => (
                <div
                    key={booking.id}
                    className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950 rounded-xl flex items-center justify-center text-xl">
                        ✂️
                    </div>
                    <div>
                        <h3 className="font-semibold text-zinc-900 dark:text-white">
                        {booking.service.name}
                        </h3>
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {new Date(booking.date).toLocaleDateString('en-GB')} · {booking.slot} · {booking.service.duration} mins
                        </p>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-400 mt-0.5">
                        Rs. {booking.service.price.toLocaleString()}
                        </p>
                    </div>
                    </div>
                    <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusColor(booking.status)}`}>
                    {booking.status}
                    </span>
                </div>
                ))}
            </div>
            )}

            <div className="mt-6">
            <Link
                href="/"
                className="text-sm text-purple-600 hover:text-purple-500 hover:underline"
            >
                ← Back to Services
            </Link>
            </div>

        </div>
        </div>
    )
}
