"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const users = await prisma.user.findMany();
    console.log('USERS IN DB:', users.length);
    users.forEach(u => console.log(u.email));
}
main().catch(console.error).finally(() => prisma.$disconnect());
