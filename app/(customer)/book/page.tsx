import { Suspense } from "react"
import BookPageClient from "@/components/BookPageClient"

export default function BookPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <p className="text-zinc-500">Loading...</p>
      </div>
    }>
      <BookPageClient />
    </Suspense>
  )
}