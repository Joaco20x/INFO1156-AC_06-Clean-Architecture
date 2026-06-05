import { PrismaLibSql } from "@prisma/adapter-libsql"
import { PrismaClient } from "@prisma/client"

const DATABASE_URL = "file:./sqlite.db"

export const prisma = new PrismaClient({
    adapter: new PrismaLibSql({ url: DATABASE_URL }),
})
