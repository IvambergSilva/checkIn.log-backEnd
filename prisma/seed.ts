import { Prisma } from '@prisma/client';
import { prisma } from '../src/lib/prisma';
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs';

const accessibilities = ['Rampas de Acesso', 'Contraste Alto', 'Braille', 'Letras Grandes', 'Banheiros Acessíveis', 'Nenhuma']

const treatAs = ['Masculino', 'Feminino']

async function seed() {
    await prisma.event.deleteMany()

    const eventId = 'bef2c7e9-feb1-49b7-a127-d0791e09bd5b';

    const maximumAttendeesBase = 122;

    await prisma.event.create({
        data: {
            id: eventId,
            title: 'DevFest',
            slug: 'dev-fest',
            details: 'Um evento para Devs em João Pessoa',
            maximumAttendees: maximumAttendeesBase
        }
    })

    const attendeesToInsert: Prisma.AttendeesUncheckedCreateInput[] = []

    for (let i = 0; i < maximumAttendeesBase; i++) {
        const attendeeId = await import('nanoid').then(({ customAlphabet, }) => {
            const id = customAlphabet('123456789abcdefghi', 6)
            return id()
        })

        const checkInId = await import('nanoid').then(({ customAlphabet, }) => {
            const id = customAlphabet('123456789', 6)
            return id()
        })

        attendeesToInsert.push({
            id: attendeeId,
            name: faker.person.fullName(),
            socialName: null,
            email: faker.internet.email(),
            age: Math.floor(Math.random() * (40 - 18 + 1)) + 18,
            eventId,
            gender: faker.person.sex(),
            accessibility: accessibilities[Math.floor(Math.random() * accessibilities.length)],
            createdAt: faker.date.recent({
                days: 30, refDate: dayjs().subtract(8, "days").toDate()
            }),
            checkIn: faker.helpers.arrayElement<Prisma.CheckInUncheckedCreateNestedOneWithoutAttendeeInput | undefined>([
                {
                    create: {
                        id: checkInId,
                        createdAt: faker.date.recent({ days: 7 }),
                    }
                }
            ]),
            customGender: null,
            treatAs: null
        })
    }
    await Promise.all(attendeesToInsert.map(data => {
        return prisma.attendees.create({ data })
    }))
}

seed().then(() => {
    console.log('Database seeded!');
    prisma.$disconnect()
})