'use server'

import { prisma } from '@/lib/prisma'

export async function createBooking(prevState: any, formData: FormData) {
    const userId = formData.get('userId') as string
    const serviceId = formData.get('serviceId') as string
    const date = formData.get('date') as string
    const slot = formData.get('slot') as string

    if (!userId || !serviceId || !date || !slot) {
        return { error: 'All fields are required' }
    }

    // Check if slot already booked
    const existing = await prisma.booking.findFirst({
        where: {
        serviceId,
        date: new Date(date),
        slot,
        status: { not: 'CANCELLED' }
        }
    })

    if (existing) {
        return { error: 'This slot is already booked!' }
    }

    await prisma.booking.create({
        data: {
        userId,
        serviceId,
        date: new Date(date),
        slot,
        status: 'PENDING'
        }
    })

    return { success: 'Booking confirmed!' }
    }

    export async function getAllBookings() {
    return await prisma.booking.findMany({
        include: {
        user: { select: { name: true, email: true } },
        service: { select: { name: true, price: true } }
        },
        orderBy: { createdAt: 'desc' }
    })
    }

    export async function updateBookingStatus(bookingId: string, status: 'CONFIRMED' | 'CANCELLED') {
    await prisma.booking.update({
        where: { id: bookingId },
        data: { status }
    })
    return { success: 'Status updated!' }
}

export async function getAllUsers() {
    return await prisma.user.findMany({
        select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        },
        orderBy: { createdAt: 'desc' }
    })
    }

export async function updateUserRole(userId: string, role: 'ADMIN' | 'CUSTOMER') {
    await prisma.user.update({
        where: { id: userId },
        data: { role }
    })
    return { success: 'Role updated!' }
    }
