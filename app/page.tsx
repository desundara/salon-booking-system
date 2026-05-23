export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import HomeClient from "@/components/HomeClient"

const SERVICE_ICONS: Record<string, string> = {
  "Haircut": "✂️",
  "Beard Trim": "🪒",
  "Hair Color": "🎨",
  "Hair Wash": "🚿",
  "Facial": "💆",
  "Full Package": "⭐",
}

export default async function HomePage() {
  const services = await prisma.service.findMany()
  return <HomeClient services={services} icons={SERVICE_ICONS} />
}