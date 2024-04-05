import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getAttendeeBadge(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/events/attendees/:attendeeId/badge', {
            schema: {
                params: z.object({
                    attendeeId: z.coerce.number().int()
                }),
                response: {
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
                throw new Error('Usuário não encontrado')
            }

            return res.status(200).send({
                attendee: attendee
            })
        })
}