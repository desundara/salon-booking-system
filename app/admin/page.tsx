// import { getAllBookings } from "@/lib/actions/booking.actions"
// import AdminClient from "@/components/AdminClient"

// export default async function AdminPage() {
//     const bookings = await getAllBookings()
//     return <AdminClient bookings={bookings} />
// }


import { getAllBookings, getAllUsers } from "@/lib/actions/booking.actions"
import AdminClient from "@/components/AdminClient"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function AdminPage() {
    const session = await auth()

    // Not logged in
    if (!session) {
        redirect('/login')
    }

    // Not admin
    if ((session.user as any).role !== 'ADMIN') {
        redirect('/')
    }

    const bookings = await getAllBookings()
    const users = await getAllUsers()
    return <AdminClient bookings={bookings} users={users} />
}