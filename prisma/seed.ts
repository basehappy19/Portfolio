import "dotenv/config";
import prisma from "../lib/prisma";

async function main() {
    const defaultEmails = [
        "pakpoom.td@gmail.com",
        "pakpoom.myself@gmail.com",
    ];

    for (const email of defaultEmails) {

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
