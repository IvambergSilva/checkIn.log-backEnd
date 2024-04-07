import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

interface IAttendeesProps {
    name: string;
    socialName?: string;
    email: string;
    age: number;
    gender: string;
    customGender: string;
    treatAs: string;
    accessibility: string;
}

export async function registerForEvents(app: FastifyInstance) {
    app.
        withTypeProvider<ZodTypeProvider>()
        .post('/events/:eventId/attendees', {
            schema: {
                summary: 'Register an attendee',
                tags: ['attendee'],
                body: z.object({
                    name: z.string().min(4),
                    socialName: z.string(),
                    email: z.string().email(),
                    age: z.number().int().positive(),
                    gender: z.string(),
                    customGender: z.string(),
                    treatAs: z.string(),
                    accessibility: z.string(),
                }),
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    201: z.object({
                        attendee: z.object({
                            attendeeId: z.string(),
                            name: z.string(),
                            socialName: z.string().nullish(),
                            email: z.string().email(),
                            age: z.number().int().positive(),
                            gender: z.string(),
                            customGender: z.string(),
                            treatAs: z.string(),
                            accessibility: z.string(),
                            eventId: z.string()
                        })
                    })
                }
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { name, socialName, email, age, gender, customGender, treatAs, accessibility }: IAttendeesProps = req.body as IAttendeesProps

            const { eventId }: { eventId: string } = req.params as { eventId: string }

            const [event, amountOfAttendeesForEvent] = await Promise.all([
                prisma.event.findUnique({
                    where: {
                        id: eventId
                    }
                }),
                prisma.attendees.count({
                    where: {
                        eventId
                    }
                })
            ])

            if (event?.maximumAttendees && amountOfAttendeesForEvent >= event?.maximumAttendees) {
                throw new BadRequest('O número limite de participantes já foi atingido')
            }

            const attendeeFromEmail = await prisma.attendees.findUnique({
                where: {
                    eventId_email: {
                        email, eventId
                    }
                }
            })

            if (attendeeFromEmail !== null) {
                throw new BadRequest('Este email já está registrado neste evento.')
            }

            const attendeeId = await import('nanoid').then(({ customAlphabet }) => {
                const id = customAlphabet('123456789abcdefghi', 6);
                return id();
            })

            const attendee = await prisma.attendees.create({
                data: {
                    id: attendeeId, socialName, name, email, age, gender, customGender, treatAs, accessibility, eventId
                },
            })

            return res.status(201).send({
                attendee: {
                    attendeeId: attendee.id,
                    name: attendee.name,
                    socialName: attendee.socialName,
                    email: attendee.email,
                    age: attendee.age,
                    gender: attendee.gender,
                    customGender: attendee.customGender,
                    treatAs: attendee.treatAs,
                    accessibility: attendee.accessibility,
                    eventId: attendee.eventId
                }
            })
        })
}