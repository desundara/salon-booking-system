'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerUser(prevState: any, formData: FormData) {
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Validation
    if (!name || !email || !password) {
        return { error: 'All fields are required' }
    }

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match' }
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters' }
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        return { error: 'Email already registered' }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Save to database
    await prisma.user.create({
        data: {
        name,
        email,
        password: hashedPassword,
        }
    })

    return { success: 'Account created successfully!' }
}

export async function loginUser(prevState: any, formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return { error: 'All fields are required' }
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
        where: { email }
    })

    if (!user) {
        return { error: 'Invalid email or password' }
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
        return { error: 'Invalid email or password' }
    }

    return { success: 'Logged in successfully!', userId: user.id }
    }