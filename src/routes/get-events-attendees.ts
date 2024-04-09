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
                summary: 'Get event attendees',
                tags: ['events'],
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
                                id: z.string(),
                                name: z.string().min(4),
                                socialName: z.string().nullable(),
                                email: z.string().email(),
                                createdAt: z.date(),
                                checkedInAt: z.date().nullable(),
                            })
                        ),
                        eventTitle: z.string(),
                        total: z.number()
                    })
                },
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { eventId } = req.params as { eventId: string }

            const { pageIndex, query } = req.query as IQueryProps

            const [attendees, total, eventTitle] = await Promise.all([
                prisma.attendees.findMany({
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
                        },
                        event: {
                            select: {
                                title: true
                            }
                        }
                    },
                    where: query
                        ? {
                            eventId,
                            OR: [
                                {
                                    socialName: {
                                        contains: query,
                                        mode: "insensitive"
                                    },
                                },
                                {
                                    socialName: null,
                                    name: {
                                        contains: query,
                                        mode: "insensitive"
                                    },
                                },
                            ],
                        }
                        : {
                            eventId,
                        },
                    take: 10,
                    skip: pageIndex * 10,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }),
                prisma.attendees.count({
                    where: query ? {
                        eventId,
                        OR: [
                            {
                                socialName: {
                                    contains: query,
                                    mode: "insensitive"
                                },
                            },
                            {
                                socialName: null,
                                name: {
                                    contains: query,
                                    mode: "insensitive"
                                },
                            },
                        ],
                    } : {
                        eventId,
                    },
                }),
                prisma.event.findUnique({
                    select: {
                        title: true
                    },
                    where: {
                        id: eventId
                    }
                })
            ])


            return res.status(200).send({
                attendees: attendees.map(attendee => {
                    return {
                        id: attendee.id,
                        name: attendee.name,
                        socialName: attendee.socialName,
                        email: attendee.email,
                        createdAt: attendee.createdAt,
                        checkedInAt: attendee.checkIn?.createdAt ?? null
                    }
                }),
                eventTitle: eventTitle?.title,
                total,
            })
        })
}
