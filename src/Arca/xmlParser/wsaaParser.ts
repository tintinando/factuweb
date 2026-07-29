import { XMLParser } from "fast-xml-parser";
import type { LoginCmsResponse } from "../../types/arca.types";

const parser = new XMLParser({
   ignoreAttributes: true,
   trimValues: true,
   removeNSPrefix: true
});

export function parseLoginCmsResult(xml: string): LoginCmsResponse {
   const parsed = parser.parse(xml);
   const body = parsed?.Envelope?.Body

   if (!body) {
      throw new Error("Estructura de respuesta del SOAP inválida")
   }

   if (body.Fault) {
      const faultMsg = body.Fault.faultstring || "Error desconocido en el WSAA"
      throw new Error(`Error en la respuesta SOAP: ${faultMsg}`);
   }

   const innerXml = body.loginCmsResponse?.loginCmsReturn

   if (!innerXml) {
      throw new Error("No se encontró el nodo loginCmsReturn en la respuesta")
   }

   const parsedTicket = parser.parse(innerXml)
   const credentials = parsedTicket?.loginTicketResponse?.credentials

   if (!credentials?.token || !credentials?.sign) {
      throw new Error("El ticket de acceso no contiene las credenciales")
   }

   return {
      token: credentials.token,
      sign: credentials.sign,
      expirationTime: parsedTicket.header.expirationTime
   }
}
