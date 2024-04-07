import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";
import { BadRequest } from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema: {
                summary: 'Check-in an attendee',
                tags: ['chek-ins'],
                params: z.object({
                    attendeeId: z.string()
                }),
                response: {
                    200: z.object({
                        checkInId: z.object({
                            checkInId: z.string(),
                            createdAt: z.string().datetime(),
                            attendeesId: z.string()
                        })
                    })
                }
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { attendeeId }: { attendeeId: string } = req.params as { attendeeId: string }

            const attendeeCheckIn = await prisma.checkIn.findUnique({
                where: {
                    attendeesId: attendeeId
                }
            })

            if (attendeeCheckIn !== null) {
                throw new BadRequest('Usuário já fez o check-in')
            }

            const checkInId = await import('nanoid').then(({customAlphabet, }) => {
                const id = customAlphabet('123456789', 6)
                return id()
            })

            const checkIn = await prisma.checkIn.create({
                data: {
                    id: checkInId,
                    attendeesId: attendeeId
                }
            })

            return res.status(200).send({
                checkInId: {
                    checkInId: checkIn.id,
                    createdAt: checkIn.createdAt.toISOString(),
                    attendeesId: checkIn.attendeesId
                }
            })
        })
}
