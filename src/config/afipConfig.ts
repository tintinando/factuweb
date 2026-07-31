import { Context } from "hono"
import { Environment, isEnvironment } from "../types/env.types"
import { Env } from "../types/env.types"

export interface AfilUrls {
    wsaa: string
    wsfe: string
}

export interface AfipConfig {
    environment: Environment
    key: string
    pem: string
    cuit: string
    urls: AfilUrls
}

const AFIP_URLS: Record<Environment, AfilUrls> = {
    production: {
        wsaa: "https://wsaa.afip.gov.ar/ws/services/LoginCms",
        wsfe: "https://servicios1.afip.gov.ar/wsfev1/service.asmx"
    },
    testing: {
        wsaa: "https://wsaahomo.afip.gov.ar/ws/services/LoginCms",
        wsfe: "https://wswhomo.afip.gov.ar/wsfev1/service.asmx"
    }
}

export function afipConfig(c: Context<Env>): AfipConfig {
    const environment: Environment = isEnvironment(c.env.ENVIRONMENT) ? c.env.ENVIRONMENT : "testing"
    const isProd = environment === "production"

    return {
        environment,
        key: isProd ? c.env.AFIP_PRODUCTION_KEY : c.env.AFIP_TESTING_KEY,
        pem: isProd ? c.env.AFIP_PRODUCTION_PEM : c.env.AFIP_TESTING_PEM,
        cuit: isProd ? c.env.AFIP_PRODUCTION_CUIT : c.env.AFIP_TESTING_CUIT,
        urls: AFIP_URLS[environment]
    }
}
