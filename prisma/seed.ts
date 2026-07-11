import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
    const defaultEmails = [
        "pakpoom.td@gmail.com",
        "pakpoom.myself@gmail.com",
    ];

    const envEmails = (process.env.ALLOWED_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

    const allEmails = Array.from(new Set([...defaultEmails, ...envEmails]));

    for (const email of allEmails) {
        await prisma.allowedEmail.upsert({
            where: { email },
            update: {},
            create: { email },
        });
        console.log(`Seeded allowed email: ${email}`);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
