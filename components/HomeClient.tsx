'use client'

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession, signOut } from "next-auth/react"
import { useState, useRef, useEffect } from "react"
import { User, LogOut, Calendar, ChevronDown } from "lucide-react"

type Service = {
    id: string
    name: string
    duration: number
    price: number
    }

    export default function HomeClient({
    services,
    icons,
    }: {
    services: Service[]
    icons: Record<string, string>
    }) {
    const { data: session } = useSession()
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
            setDropdownOpen(false)
        }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

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

            {session ? (
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

                {/* Dropdown */}
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
            ) : (
                <Link href="/login" className="text-sm bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-xl transition-all">
                Sign In
                </Link>
            )}
            </div>
        </nav>

        {/* Hero */}
        <div className="text-center py-16 px-4">
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-white mb-3">
            Book Your Appointment
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">
            Choose a service and pick your time
            </p>
        </div>

        {/* Services */}
        <div className="max-w-4xl mx-auto px-6 pb-16">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-6">
            Our Services
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {services.map((service) => (
                <div
                key={service.id}
                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 hover:shadow-lg hover:border-purple-300 dark:hover:border-purple-700 transition-all group"
                >
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-950 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:bg-purple-100 dark:group-hover:bg-purple-900 transition-all">
                    {icons[service.name] || "✂️"}
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">
                    {service.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                    {service.duration} mins
                </p>
                <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-700 dark:text-purple-400">
                    Rs. {service.price.toLocaleString()}
                    </span>
                    <Link
                    href={`/book?serviceId=${service.id}&serviceName=${service.name}`}
                    className="text-sm bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                    Book
                    </Link>
                </div>
                </div>
            ))}
            </div>
        </div>

        </div>
    )
}