'use client'

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useActionState } from "react"
import { registerUser } from "@/lib/actions/auth.actions"

export default function RegisterPage() {
    const { theme, setTheme } = useTheme()
    const [state, formAction, pending] = useActionState(registerUser, null)

    return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-4 py-10">

        {/* Theme Toggle */}
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="fixed top-4 right-4 p-2.5 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all z-50"
        >
            {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-yellow-400" />
            ) : (
            <Moon className="h-4 w-4 text-zinc-700" />
            )}
        </button>

        <div className="w-full max-w-md">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl p-8">

            {/* Header */}
            <div className="text-center mb-8">
                <div className="w-14 h-14 bg-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl shadow-lg shadow-purple-900/30">
                ✂️
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
                Create Account
                </h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                Join us today
                </p>
            </div>

            {/* Success / Error messages */}
            {state?.error && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {state.error}
                </div>
            )}
            {state?.success && (
                <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 text-sm">
                {state.success}
                </div>
            )}

            {/* Form */}
            <form action={formAction} className="space-y-5">
                <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Full Name
                </label>
                <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                />
                </div>

                <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                    Confirm Password
                </label>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all"
                />
                </div>

                <button
                type="submit"
                disabled={pending}
                className="w-full bg-purple-700 hover:bg-purple-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all shadow-lg shadow-purple-900/20"
                >
                {pending ? 'Creating...' : 'Create Account'}
                </button>
            </form>

            <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
                <span className="text-xs text-zinc-400">or</span>
                <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-purple-600 hover:text-purple-500 hover:underline">
                Sign In
                </Link>
            </p>

            </div>
        </div>
        </div>
    )
}