import type { Context, Next } from "hono"
import { Bindings } from "../types/env.types"

type Env = {
    Bindings: Bindings
}

export async function authMiddleware(c: Context<Env>, next: Next) {
    const token = c.req.header("X-API-Key")

    if (token !== c.env.API_TOKEN) {
        return c.json({ error: "Unauthorized" }, 401)
    }

    await next()
}