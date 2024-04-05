import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { generateSlogan } from "../utils/generate";
import { prisma } from "../lib/prisma";

interface IEventsProps {
    title: string;
    details: string | null;
    maximumAttendees: number | null;
}

export async function createEvent(app: FastifyInstance) {
    app.
        withTypeProvider<ZodTypeProvider>()
        .post('/events', {
            schema: {
                body: z.object({
                    title: z.string().min(4),
                    details: z.string().nullable(),
                    maximumAttendees: z.number().int().positive().nullable()
                }),
                response: {
                    201: z.object({
                        eventId: z.string().uuid()
                    })
                }
            },
        }, async (req: FastifyRequest, res: FastifyReply) => {
            const { title, details, maximumAttendees }: IEventsProps = req.body as IEventsProps;

            const slug = generateSlogan(title)

            const eventWithSameSlug = await prisma.event.findUnique({
                where: {
                    slug
                }
            })

            if (eventWithSameSlug !== null) {
                throw new Error("Já existe um evento com o mesmo título.")
            }

            const event = await prisma.event.create({
                data: {
                    title,
                    details,
                    slug,
                    maximumAttendees
                }
            })

            return res.status(201).send(`Evento ${event.title} com o id: ${event.id} criado`)
        })
}