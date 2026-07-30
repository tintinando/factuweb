import { Context } from "hono"
import { Environment, isEnvironment } from "../types/env.types"
import { Env } from "../types/env.types"

export interface AfipConfig {
    environment: Environment
    key: string
    pem: string
    cuit: string
}

export function afipConfig(c: Context<Env>): AfipConfig {
    const environment: Environment = isEnvironment(c.env.ENVIRONMENT) ? c.env.ENVIRONMENT : "testing"

    if (environment === "production") {
        return {
            environment,
            key: c.env.AFIP_PRODUCTION_KEY,
            pem: c.env.AFIP_PRODUCTION_PEM,
            cuit: c.env.AFIP_PRODUCTION_CUIT
        }
    }

    return {
        environment,
        key: c.env.AFIP_TESTING_KEY,
        pem: c.env.AFIP_TESTING_PEM,
        cuit: c.env.AFIP_TESTING_CUIT
    }
}
