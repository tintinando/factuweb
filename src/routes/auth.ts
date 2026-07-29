import { Hono } from "hono";
import { getArcaTA } from "../Arca/service/wsaaService";
import { Environment, isEnvironment, LoginCmsResponse } from "../types/arca.types";
import { Bindings } from "../types/env.types";

export const auth = new Hono<{ Bindings: Bindings }>()

auth.get("/", async (c) => {
    const environment: Environment = isEnvironment(c.env.ENVIRONMENT)
        ? c.env.ENVIRONMENT
        : "testing"

    try {
        const ticket: LoginCmsResponse = await getArcaTA({
            environment,
            cuit: c.env.CUIT,
            pem: c.env.CERT_PEM,
            key: c.env.PRIVATE_KEY
        })

        return c.json(ticket)
    } catch (e) {
        return c.text(`Error ${e}`)
    }
})
