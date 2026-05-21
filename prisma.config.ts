import path from "path"
import { defineConfig } from "prisma/config"

export default defineConfig({
  earlyAccess: true,
  schema: path.join("prisma", "schema.prisma"),
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import("@prisma/adapter-neon")
      const { neon } = await import("@neondatabase/serverless")
      const databaseUrl = process.env.DATABASE_URL!
      const sql = neon(databaseUrl)
      return new PrismaNeon({ connectionString: databaseUrl })
    },
  },
})