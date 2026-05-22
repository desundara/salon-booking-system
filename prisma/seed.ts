import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const services = [
        { name: "Haircut", duration: 30, price: 1500 },
        { name: "Beard Trim", duration: 20, price: 800 },
        { name: "Hair Color", duration: 90, price: 4500 },
        { name: "Hair Wash", duration: 15, price: 500 },
        { name: "Facial", duration: 45, price: 2500 },
        { name: "Full Package", duration: 120, price: 6000 },
    ]

    for (const service of services) {
        await prisma.service.create({
        data: service,
        })
    }

    console.log('Services seeded!')
    }

    main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())