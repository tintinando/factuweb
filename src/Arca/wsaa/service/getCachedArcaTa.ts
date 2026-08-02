import { AfipConfig } from '../../../config/afipConfig';
import { CachedTA, LoginCmsResponse } from '../types';
import { getArcaTA } from './wsaaService';

interface GetCachedArcaTAParams {
  cache: KVNamespace;
  config: AfipConfig;
  forceRefresh?: boolean; // Opción para bypass de cache
}

/**
 * Consulta la WSAA de AFIP usando el servicio GetArcaTA y guarda los token
 * obtenidos en la cache de Cloudflare KV, de modo que persistan 12 horas
 * @param param0
 * @returns
 */
export async function getCachedArcaTA({
  cache,
  config,
  forceRefresh = false
}: GetCachedArcaTAParams): Promise<LoginCmsResponse> {
  const { cuit, pem, key, environment } = config;
  const cacheKey = `afip_ta_${environment}_${cuit}`;

  // 1. Si no se fuerza el refresco, intentamos leer desde KV
  if (!forceRefresh) {
    const cachedData = await cache.get<CachedTA>(cacheKey, 'json');

    if (cachedData) {
      // Verificamos si aún le queda margen de tiempo (ej. más de 5 minutos antes de expirar)
      const expiresAt = new Date(cachedData.expirationTime).getTime();
      const now = Date.now();
      const FIVE_MINUTES = 5 * 60 * 1000;

      if (expiresAt - now > FIVE_MINUTES) {
        return cachedData;
      }
    }
  }

  // 2. Si no hay cache, está vencido o forceRefresh es true, consultamos a WSAA
  const freshTA = await getArcaTA(config);

  // 3. Guardamos en Cloudflare KV con expirationTtl (11.5 horas en segundos = 41400)
  const expiresAt = new Date(freshTA.expirationTime).getTime();
  const ttl = Math.max(60, Math.floor((expiresAt - Date.now()) / 1000));

  await cache.put(
    cacheKey,
    JSON.stringify({
      token: freshTA.token,
      sign: freshTA.sign,
      expirationTime: freshTA.expirationTime
    }),
    { expirationTtl: ttl }
  );

  return freshTA;
}
