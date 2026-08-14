import { AfipConfig } from "../../../config/afipConfig";
import { FECAESolicitarResponse, WsfeDetalle, WsfeHeader } from "../types/types";
import { buildWsfeRequest } from "../xmlBuilders/buildWsfeRequest";
import { parseFECAEResponse } from "../xmlParser/wsfeParser";
import { LoginCmsResponse } from "../../wsaa/types";

const TIMEOUT = 15000;

interface ObtenerCAEParams {
  auth: LoginCmsResponse;
  config: AfipConfig;
  header: WsfeHeader;
  detalles: WsfeDetalle[];
}

export async function obtenerCAE({
  auth,
  config,
  header,
  detalles,
}: ObtenerCAEParams): Promise<FECAESolicitarResponse> {
  // controlador para cancelar consulta
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  const raw = buildWsfeRequest({
    auth: {
      token: auth.token,
      sign: auth.sign,
      cuit: config.cuit,
    },
    header,
    detalles,
  });

  try {
    const response = await fetch(config.urls.wsfe, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction: "http://ar.gov.afip.dif.FEV1/FECAESolicitar",
      },
      body: raw,
      signal: controller.signal,
    });

    const xml = await response.text();

    if (!response.ok) {
      throw new Error(`Error en obtenerCAE: ${response.status} ${response.text()}`);
    }

    return parseFECAEResponse(xml);
  } finally {
    clearTimeout(timeoutId);
  }
}
