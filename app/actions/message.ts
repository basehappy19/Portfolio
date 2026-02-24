"use server";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

export async function saveMessage(data: { name: string; email: string; message: string }) {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });
    
    const { name, email, message } = data;

    await prisma.message.create({
        data: { name, email, message },
    });

    return { success: true };
}
