import { FastifyInstance, FastifyRequest, FastifyReply, FastifyError } from "fastify"
import { BadRequest } from "./routes/_errors/bad-request"
import { ZodError } from "zod"

type fastifyErrorHandler = FastifyInstance['errorHandler']

export const errorHandler: fastifyErrorHandler = (error: FastifyError, req: FastifyRequest, res: FastifyReply) => {
    if(error instanceof ZodError) {
        return res.status(400).send({
            message: 'Error during validation',
            errors: error.flatten().fieldErrors
        })
    }

    if (error instanceof BadRequest) {
        return res.status(400).send({
            message: error.message
        })
    }
    return res.status(500).send({ message: 'Internal Server Error' })
}
