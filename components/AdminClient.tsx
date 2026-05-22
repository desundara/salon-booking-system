'use client'

import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"
import { updateBookingStatus, updateUserRole } from "@/lib/actions/booking.actions"
import { useRouter } from "next/navigation"

type Booking = {
  id: string
  date: Date
  slot: string
  status: string
  user: { name: string | null; email: string }
  service: { name: string; price: number }
}

type User = {
  id: string
  name: string | null
  email: string
  role: string
  createdAt: Date
}

export default function AdminClient({
  bookings,
  users,
}: {
  bookings: Booking[]
  users: User[]
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'bookings' | 'users'>('bookings')

  const handleStatus = async (id: string, status: 'CONFIRMED' | 'CANCELLED') => {
    await updateBookingStatus(id, status)
    router.refresh()
  }

  const handleRoleChange = async (userId: string, role: 'ADMIN' | 'CUSTOMER') => {
    await updateUserRole(userId, role)
    router.refresh()
  }

  const statusColor = (status: string) => {
    if (status === 'CONFIRMED') return 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
    if (status === 'CANCELLED') return 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
    return 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
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
          <span className="text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full ml-1">
            Admin
          </span>
        </div>
        <ThemeToggle />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-800">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'bookings'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
              activeTab === 'users'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
            }`}
          >
            Users ({users.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <>
            {/* Stats */}
            <div className="flex gap-3 mb-6">
              <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-xl px-4 py-2 text-center">
                <p className="text-lg font-bold text-yellow-700 dark:text-yellow-400">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-500">Pending</p>
              </div>
              <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-xl px-4 py-2 text-center">
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  {bookings.filter(b => b.status === 'CONFIRMED').length}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500">Confirmed</p>
              </div>
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl px-4 py-2 text-center">
                <p className="text-lg font-bold text-red-700 dark:text-red-400">
                  {bookings.filter(b => b.status === 'CANCELLED').length}
                </p>
                <p className="text-xs text-red-600 dark:text-red-500">Cancelled</p>
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {bookings.length === 0 ? (
                <div className="text-center py-16 text-zinc-500 dark:text-zinc-400">No bookings yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                        <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Customer</th>
                        <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Service</th>
                        <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Date</th>
                        <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Time</th>
                        <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Status</th>
                        <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((booking, i) => (
                        <tr key={booking.id} className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${i === bookings.length - 1 ? 'border-0' : ''}`}>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">{booking.user.name}</p>
                            <p className="text-xs text-zinc-500">{booking.user.email}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-zinc-900 dark:text-white">{booking.service.name}</p>
                            <p className="text-xs text-zinc-500">Rs. {booking.service.price.toLocaleString()}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">
                            {new Date(booking.date).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-6 py-4 text-sm text-zinc-700 dark:text-zinc-300">{booking.slot}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {booking.status === 'PENDING' && (
                                <>
                                  <button onClick={() => handleStatus(booking.id, 'CONFIRMED')} className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg transition-all">Confirm</button>
                                  <button onClick={() => handleStatus(booking.id, 'CANCELLED')} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-all">Cancel</button>
                                </>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <button onClick={() => handleStatus(booking.id, 'CANCELLED')} className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition-all">Cancel</button>
                              )}
                              {booking.status === 'CANCELLED' && <span className="text-xs text-zinc-400">—</span>}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
                    <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Name</th>
                    <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Email</th>
                    <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Role</th>
                    <th className="text-left text-xs font-medium text-zinc-500 px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, i) => (
                    <tr key={user.id} className={`border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors ${i === users.length - 1 ? 'border-0' : ''}`}>
                      <td className="px-6 py-4 text-sm font-medium text-zinc-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 text-sm text-zinc-500">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          user.role === 'ADMIN'
                            ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-400'
                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role === 'CUSTOMER' ? (
                          <button
                            onClick={() => handleRoleChange(user.id, 'ADMIN')}
                            className="text-xs bg-purple-700 hover:bg-purple-600 text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRoleChange(user.id, 'CUSTOMER')}
                            className="text-xs bg-zinc-600 hover:bg-zinc-500 text-white px-3 py-1.5 rounded-lg transition-all"
                          >
                            Make Customer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}