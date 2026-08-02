import { AfipConfig } from '../../../config/afipConfig';
import { FECAESolicitarResponse, WsfeDetalle, WsfeHeader } from '../types';
import { buildWsfeRequest } from '../xmlBuilders/buildWsfeRequest';
import { getCachedArcaTA } from '../../wsaa/service/getCachedArcaTa';
import { parseFECAEResponse } from '../xmlParser/wsfeParser';

const TIMEOUT = 15000;

export async function obtenerCAE(
  cache: KVNamespace,
  config: AfipConfig,
  header: WsfeHeader,
  detalles: WsfeDetalle[]
): Promise<FECAESolicitarResponse> {
  // controlador para cancelar consulta
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const auth = await getCachedArcaTA({
    cache,
    config
  });

  const raw = buildWsfeRequest({
    auth: {
      token: auth.token,
      sign: auth.sign,
      cuit: config.cuit
    },
    header,
    detalles
  });

  try {
    const response = await fetch(config.urls.wsfe, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'http://ar.gov.afip.dif.FEV1/FECAESolicitar'
      },
      body: raw,
      signal: controller.signal
    });

    const xml = await response.text();

    if (!response.ok) {
      throw new Error(
        `Error en obtenerCAE: ${response.status} ${response.text()}`
      );
    }

    return parseFECAEResponse(xml);
  } finally {
    clearTimeout(timeoutId);
  }
}
