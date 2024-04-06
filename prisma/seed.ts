import {prisma} from '../src/lib/prisma';

async function seed() {
    await prisma.event.create({
        data: {
            id: '300b8deb-ae7f-43df-8243-441b88436c97',
            title: 'DevFest',
            slug: 'dev-fest',
            details: 'Um evento para Devs em João Pessoa',
            maximumAttendees: 125
        }
    })
}

seed().then(() => {
    console.log('Database seeded!');
    prisma.$disconnect()
})