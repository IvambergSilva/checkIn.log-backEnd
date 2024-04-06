import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z, { nullable } from "zod";
import { prisma } from "../lib/prisma";
import { ZodTypeProvider } from "fastify-type-provider-zod";

interface IQueryProps {
    pageIndex: number,
    query: string
}

export async function getEventsAttendees(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>()
        .get('/events/:eventId/attendees', {
            schema: {
                params: z.object({
                    eventId: z.string().uuid()
                }),
                querystring: z.object({
                    query: z.string().nullish(),
                    pageIndex: z.string().nullish().default('0').transform(Number)
                }),
                response: {
                    200: z.object({
                        attendees: z.array(
                            z.object({
                                id: z.number(),
                                name: z.string().min(4),
                                socialName: z.string().nullable(),
                                email: z.string().email(),
                                createdAt: z.date(),
                                checkInAt: z.date().nullable(),
                            })
                        )
                    })
                },
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { eventId }: { eventId: string } = req.params as { eventId: string }

            const { pageIndex, query }: IQueryProps = req.query as IQueryProps

            const attendees = await prisma.attendees.findMany({
                select: {
                    id: true,
                    name: true,
                    socialName: true,
                    email: true,
                    createdAt: true,
                    checkIn: {
                        select: {
                            createdAt: true,
                        }
                    }
                },
                where: query
                    ? {
                        eventId,
                        name: {
                            contains: query
                        }
                    }
                    : {
                        eventId,
                    },
                take: 10,
                skip: pageIndex * 10,
                orderBy: {
                    createdAt: 'desc'
                }
            })

            return res.status(200).send({
                attendees: attendees.map(attendee => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        socialName: attendee.socialName,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        checkInAt: attendee.checkIn?.createdAt ?? null
                    }
                })
            })
        })
}
