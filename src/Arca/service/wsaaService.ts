import { AfipConfig } from "../../config/afipConfig";
import { signCms } from "../../helpers/crypto";
import type { LoginCmsResponse } from "../../types/arca.types";
import { envelope } from "../xmlBuilders/buildEnvelope";
import { buildLoginTicketRequest } from "../xmlBuilders/buildLoginTicketRequest";
import { parseLoginCmsResult } from "../xmlParser/wsaaParser";
import { parseLoginCmsErrorResult } from "../xmlParser/wsaaErrorParser";

const TIMEOUT = 15000

/**
 * Obtiene un Ticket de Acceso (TA) desde el WSAA de ARCA/AFIP.
 *
 * El TA contiene el `token` y el `sign` necesarios para autenticarse
 * en los Web Services de negocio.
 *
 * @param props Configuración de autenticación y entorno.
 * @returns Respuesta del WSAA con el Ticket de Acceso.
 *
 * @throws {Error}
 * Si ocurre cualquiera de las siguientes situaciones:
 * - Error al firmar el Login Ticket Request.
 * - La solicitud excede el tiempo máximo de espera (15 s).
 * - El WSAA responde con un código HTTP distinto de 2xx.
 * - La respuesta XML no puede interpretarse o representa un error SOAP.
 */
export async function getArcaTA(config: AfipConfig): Promise<LoginCmsResponse> {

    const rawCms = signCms({
        xml: buildLoginTicketRequest({ env: config.environment, cuit: config.cuit }),
        certificatePem: config.pem,
        privateKeyPem: config.key
    })

    // controlador para cancelar consulta
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    try {
        const response = await fetch(config.urls.wsaa, {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": "urn:LoginCms"
            },
            body: envelope(rawCms),
            signal: controller.signal
        })

        const xml = await response.text()

        if (!response.ok) {
            const fault = parseLoginCmsErrorResult(xml)
            throw new Error(
                `HTTP ${response.status}: ${fault.faultcode} - ${fault.faultstring}`
            )
        }

        return parseLoginCmsResult(xml)
    } finally {
        clearTimeout(timeoutId)
    }
}
