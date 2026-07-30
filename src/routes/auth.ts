import { Hono } from "hono";
import { getArcaTA } from "../Arca/service/wsaaService";
import { Bindings } from "../types/env.types";
import { afipConfig } from "../config/afipConfig";
import { LoginCmsResponse } from "../types/arca.types";

export const auth = new Hono<{ Bindings: Bindings }>()

auth.get("/", async (c) => {
    const config = afipConfig(c)

    try {
        const ticket: LoginCmsResponse = await getArcaTA(config)

        return c.json(ticket)
    } catch (e) {
        return c.text(`Error ${e}`)
    }
})
