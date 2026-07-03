"use server";

import prisma from "@/lib/prisma";

export async function saveMessage(data: { name: string; email: string; message: string }) {
    
    const { name, email, message } = data;

    await prisma.message.create({
        data: { name, email, message },
    });

    return { success: true };
}
