import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });
    
    try {
        const { name, email, message } = await req.json();

        const saved = await prisma.message.create({
            data: { name, email, message },
        });

        return NextResponse.json({ success: true, data: saved });
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ success: false, error }, { status: 500 });
    }
}
