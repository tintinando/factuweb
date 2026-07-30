import type { Context, Next } from "hono"
import { Env } from "../types/env.types"

export async function authMiddleware(c: Context<Env>, next: Next) {
    const expected = c.env.API_TOKEN

    if (!expected) {
        throw new Error("API_TOKEN no está configurado")
    }

    const token = c.req.header("X-API-Key")

    if (token !== expected) {
        return c.json({ error: "Unauthorized" }, 401)
    }

    await next()
}
