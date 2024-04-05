import fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/attendees/:attendeeId/check-in', {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                response: {
                    200: z.object({
                        checkInId: z.object({
                            checkInId: z.coerce.number().int(),
                            createdAt: z.string().datetime(),
                            attendeesId: z.coerce.number().int()
                        })
                    })
                }
            }
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { attendeeId }: { attendeeId: number } = req.params as { attendeeId: number }

            const attendeeCheckIn = await prisma.checkIn.findUnique({
                where: {
                    attendeesId: attendeeId
                }
            })

            if (attendeeCheckIn !== null) {
                throw new Error('Usuário já fez o check-in')
            }

            const checkInId = await prisma.checkIn.create({
                data: {
                    attendeesId: attendeeId
                }
            })

            console.log(checkInId);

            return res.status(200).send({
                checkInId: {
                    checkInId: checkInId.id,
                    createdAt: checkInId.createdAt.toISOString(),
                    attendeesId: checkInId.attendeesId
                }
            })

        })
}
