import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import MyBookingsClient from "@/components/MyBookingsClient"

export default async function MyBookingsPage() {
    const session = await auth()

    if (!session) {
        redirect('/login')
    }

    const bookings = await prisma.booking.findMany({
        where: { userId: session.user?.id as string },
        include: {
        service: { select: { name: true, price: true, duration: true } }
        },
        orderBy: { createdAt: 'desc' }
    })

    return <MyBookingsClient bookings={bookings} userName={session.user?.name || ''} />
}