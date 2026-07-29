import { getArcaTA } from "./wsaaService";
import { CachedTA, Environment, LoginCmsResponse } from "../../types/arca.types";

interface GetCachedArcaTAParams {
    env: {
        AFIP_CACHE: KVNamespace;
        AFIP_CUIT: string;
        AFIP_CERT_PEM: string;
        AFIP_PRIVATE_KEY: string;
        ENVIRONMENT: Environment;
    };
    forceRefresh?: boolean; // Opción para bypass de cache
}

/**
 * Consulta la WSAA de AFIP usando el servicio GetArcaTA y guarda los token
 * obtenidos en la cache de Cloudflare KV, de modo que persistan 12 horas
 * @param param0 
 * @returns 
 */
export async function getCachedArcaTA(
    { env, forceRefresh = false }: GetCachedArcaTAParams
): Promise<LoginCmsResponse> {
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
                return cachedData
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
    const expiresAt = new Date(freshTA.expirationTime).getTime();
    const ttl = Math.max(
        60,
        Math.floor((expiresAt - Date.now()) / 1000)
    );

    await AFIP_CACHE.put(
        cacheKey,
        JSON.stringify({
            token: freshTA.token,
            sign: freshTA.sign,
            expirationTime: freshTA.expirationTime
        }),
        { expirationTtl: ttl }
    );

    return freshTA
}