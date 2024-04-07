import fastify from "fastify";
import fastifyCors from "@fastify/cors";

import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

import { serializerCompiler, validatorCompiler, jsonSchemaTransform } from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { registerForEvents } from "./routes/register-for-events";
import { getEvent } from "./routes/get-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventsAttendees } from "./routes/get-events-attendees";
import { errorHandler } from "./error-handler";

const app = fastify()

app.register(fastifyCors, {
    origin: '*'
})

app.register(fastifySwagger, {
    swagger: {
        consumes: ['application/json'],
        produces: ['application/json'],
        info: {
            title: 'CheckIn.log',
            description: 'Especificações da API para o back-end da aplicação CheckIn.log construída durante o NLW da Rocketseat.',
            version: '1.0.0'
        }
    },
    transform: jsonSchemaTransform
})

app.register(fastifySwaggerUi, {
    routePrefix: '/docs'
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvents);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn)
app.register(getEventsAttendees)

app.setErrorHandler(errorHandler)

app.listen({ port: 3333, host: '0.0.0.0' }).then(() => console.log("HTTP Server Running..."))