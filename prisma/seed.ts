const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs'); // Import 'hash' from 'bcryptjs'

const prisma = new PrismaClient();

async function main() {
    try {
        // Create a new company
        const company = await prisma.company.create({
            data: {
                name: 'Meubot',
                email: 'falecom@meubot.chat',
                phone: '123-456-7890',
                logo: 'company-logo.png',
            },
        });

        // Create a new user associated with the company
        const user = await prisma.user.create({
            data: {
                name: 'Luis Hlatki',
                email: 'luis@guilhermeh.me',
                password: await hash('123', 8), // Hash the password
                role: 'ADMIN', // or 'ADMIN' as needed
                companyId: company.id,
            },
        });
    } catch (error) {
        console.error('Error seeding the database:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
