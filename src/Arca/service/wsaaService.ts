import { signCms } from "../../helpers/crypto";
import { envelope } from "../xmlBuilders/buildEnvelope";
import { buildLoginTicketRequest, type Environment } from "../xmlBuilders/buildLoginTicketRequest";
import { LoginCmsResponse, parseLoginCmsResult } from "../xmlParser/wsaaParser";

interface GetArcaTAProps {
    environment: Environment
    cuit: string
    pem: string
    key: string
}

const TIMEOUT = 15000

const url = (environment: Environment): string =>
    environment === "testing"
        ? "https://wsaahomo.afip.gov.ar/ws/services/LoginCms"
        : "https://wsaa.afip.gov.ar/ws/services/LoginCms"


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
export async function getArcaTA(
    { environment, cuit, pem, key }: GetArcaTAProps
): Promise<LoginCmsResponse> {

    const rawCms = signCms({
        xml: buildLoginTicketRequest({ env: environment, cuit }),
        certificatePem: pem,
        privateKeyPem: key
    })

    console.log(buildLoginTicketRequest({ env: environment, cuit }))

    // controlador para cancelar consulta
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT)

    try {
        const response = await fetch(url(environment), {
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "SOAPAction": "urn:LoginCms"
            },
            body: envelope(rawCms),
            signal: controller.signal
        })

        console.log(envelope(rawCms))

        const xml = await response.text()

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${xml}`)
        }

        return parseLoginCmsResult(xml)
    } finally {
        clearTimeout(timeoutId)
    }
}
