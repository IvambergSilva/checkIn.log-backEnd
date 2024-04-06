import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function getAttendeeBadge(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/attendees/:attendeeId/badge', {
            schema: {
                summary: 'Get event attendees',
                tags: ['attendee'],
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                response: {
                    200: z.object({
                        badge: z.object({
                            name: z.string().min(4),
                            socialName: z.string().nullable(),
                            email: z.string().email(),
                            age: z.number().int(),
                            gender: z.string(),
                            customGender: z.string().nullable(),
                            treatAs: z.string().nullable(),
                            accessibility: z.string().nullable(),
                            createdAt: z.string().datetime(),
                            checkInURL: z.string().url(),
                            eventTitle: z.string(),
                            eventDetails: z.string(),
                        })
                    })
                }
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { attendeeId }: { attendeeId: number } = req.params as { attendeeId: number }

            const attendee = await prisma.attendees.findUnique({
                select: {
                    name: true,
                    socialName: true,
                    email: true,
                    age: true,
                    gender: true,
                    customGender: true,
                    treatAs: true,
                    accessibility: true,
                    createdAt: true,
                    event: {
                        select: {
                            title: true,
                            details: true
                        }
                    }
                },
                where: {
                    id: attendeeId
                }
            })

            if (attendee === null) {
                throw new BadRequest('Usuário não encontrado')
            }

            const baseURL = `${req.protocol}://${req.hostname}`

            const checkInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURL)

            return res.status(200).send({
                badge: {
                    name: attendee.name,
                    socialName: attendee.socialName,
                    email: attendee.email,
                    age: attendee.age,
                    gender: attendee.gender,
                    customGender: attendee.customGender,
                    treatAs: attendee.treatAs,
                    accessibility: attendee.accessibility,
                    createdAt: attendee.createdAt.toISOString(),
                    checkInURL: checkInURL.toString(),
                    eventTitle: attendee.event.title,
                    eventDetails: attendee.event.details
                }
            })
        })
}