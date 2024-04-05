import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

interface IAttendeesProps {
    name: string;
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
                body: z.object({
                    name: z.string().min(4),
                    socialName: z.string(),
                    email: z.string().email(),
                    age: z.number().int().positive(),
                    gender: z.string().min(3),
                    customGender: z.string(),
                    treatAs: z.string().min(3),
                    accessibility: z.string().min(5),
                }),
                params: z.object({
                    eventId: z.string().uuid()
                }),
                response: {
                    201: z.object({
                        attendeeId: z.number()
                    })
                }
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { name, email, age, gender, customGender, treatAs, accessibility }: IAttendeesProps = req.body as IAttendeesProps

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
                throw new Error('O número limite de participantes já foi atingido')
            }

            const attendeeFromEmail = await prisma.attendees.findUnique({
                where: {
                    eventId_email: {
                        email, eventId
                    }
                }
            })

            if (attendeeFromEmail !== null) {
                throw new Error('Este email já está registrado neste evento.')
            }

            const attendee = await prisma.attendees.create({
                data: {
                    name, email, age, gender, customGender, treatAs, accessibility, eventId
                },
            })

            return res.status(201).send({ attendeeId: attendee.id })
        })
}