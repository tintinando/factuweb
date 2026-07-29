import { getArcaTA } from "./wsaaService";
import type { Environment } from "../xmlBuilders/buildLoginTicketRequest";
import { CachedTA } from "../../types/arca.types";

interface GetValidArcaTAParams {
    env: {
        AFIP_CACHE: KVNamespace;
        AFIP_CUIT: string;
        AFIP_CERT_PEM: string;
        AFIP_PRIVATE_KEY: string;
        ENVIRONMENT: Environment;
    };
    forceRefresh?: boolean; // Opción para bypass de cache
}

export async function getValidArcaTA({ env, forceRefresh = false }: GetValidArcaTAParams) {
    const { AFIP_CACHE, AFIP_CUIT, AFIP_CERT_PEM, AFIP_PRIVATE_KEY, ENVIRONMENT } = env;
    const cacheKey = `afip_ta_${ENVIRONMENT}_${AFIP_CUIT}`;

    // 1. Si no se fuerza el refresco, intentamos leer desde KV
    if (!forceRefresh) {
        const cachedData = await AFIP_CACHE.get<CachedTA>(cacheKey, "json");

        if (cachedData) {
            // Verificamos si aún le queda margen de tiempo (ej. más de 5 minutos antes de expirar)
            const expiresAt = new Date(cachedData.expirationTime).getTime();
            const now = Date.now();
            const FIVE_MINUTES = 5 * 60 * 1000;

            if (expiresAt - now > FIVE_MINUTES) {
                return { token: cachedData.token, sign: cachedData.sign };
            }
        }
    }

    // 2. Si no hay cache, está vencido o forceRefresh es true, consultamos a WSAA
    const freshTA = await getArcaTA({
        environment: ENVIRONMENT,
        cuit: AFIP_CUIT,
        pem: AFIP_CERT_PEM,
        key: AFIP_PRIVATE_KEY
    });

    // 3. Guardamos en Cloudflare KV con expirationTtl (11.5 horas en segundos = 41400)
    // Nota: Cloudflare exige un mínimo de 60 segundos para expirationTtl
    const TTL_SECONDS = 11.5 * 3600; // 41.400 segundos

    await AFIP_CACHE.put(
        cacheKey,
        JSON.stringify({
            token: freshTA.token,
            sign: freshTA.sign,
            expirationTime: freshTA.expirationTime
        }),
        { expirationTtl: TTL_SECONDS }
    );

    return {
        token: freshTA.token,
        sign: freshTA.sign
    };
}