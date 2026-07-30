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
   const ticket = parsedTicket?.loginTicketResponse

   if (!ticket) {
      throw new Error("Formato de loginTicketResponse inválido")
   }

   if (!ticket.credentials?.token || !ticket.credentials?.sign) {
      throw new Error("El ticket de acceso no contiene las credenciales")
   }

   return {
      token: ticket.credentials.token,
      sign: ticket.credentials.sign,
      expirationTime: ticket.header?.expirationTime ?? ''
   }
}


`
"<?xml version=\"1.0\" encoding=\"utf-8\"?>
<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">
<soapenv:Body>
<loginCmsResponse xmlns=\"http://wsaa.view.sua.dvadac.desein.afip.gov\">
<loginCmsReturn>
&lt;?xml version=&quot;1.0&quot; encoding=&quot;UTF-8&quot; standalone=&quot;yes&quot;?&gt;\n&lt;loginTicketResponse version=&quot;1.0&quot;&gt;&lt;header&gt;&lt;source&gt;CN=wsaahomo, O=AFIP, C=AR, SERIALNUMBER=CUIT 33693450239&lt;/source&gt;&lt;destination&gt;SERIALNUMBER=CUIT 20308031382, CN=martin&lt;/destination&gt;&lt;uniqueId&gt;1586675899&lt;/uniqueId&gt;&lt;generationTime&gt;2026-07-30T13:21:19.809-03:00&lt;/generationTime&gt;&lt;expirationTime&gt;2026-07-31T01:21:19.809-03:00&lt;/expirationTime&gt;&lt;/header&gt;&lt;credentials&gt;&lt;token&gt;PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9InllcyI/Pgo8c3NvIHZlcnNpb249IjIuMCI+CiAgICA8aWQgc3JjPSJDTj13c2FhaG9tbywgTz1BRklQLCBDPUFSLCBTRVJJQUxOVU1CRVI9Q1VJVCAzMzY5MzQ1MDIzOSIgZHN0PSJDTj13c2ZlLCBPPUFGSVAsIEM9QVIiIHVuaXF1ZV9pZD0iMjk1NTA1MzU1MSIgZ2VuX3RpbWU9IjE3ODU0Mjg0MTkiIGV4cF90aW1lPSIxNzg1NDcxNjc5Ii8+CiAgICA8b3BlcmF0aW9uIHR5cGU9ImxvZ2luIiB2YWx1ZT0iZ3JhbnRlZCI+CiAgICAgICAgPGxvZ2luIGVudGl0eT0iMzM2OTM0NTAyMzkiIHNlcnZpY2U9IndzZmUiIHVpZD0iU0VSSUFMTlVNQkVSPUNVSVQgMjAzMDgwMzEzODIsIENOPW1hcnRpbiIgYXV0aG1ldGhvZD0iY21zIiByZWdtZXRob2Q9IjIyIj4KICAgICAgICAgICAgPHJlbGF0aW9ucz4KICAgICAgICAgICAgICAgIDxyZWxhdGlvbiBrZXk9IjIwMzA4MDMxMzgyIiByZWx0eXBlPSI0Ii8+CiAgICAgICAgICAgIDwvcmVsYXRpb25zPgogICAgICAgIDwvbG9naW4+CiAgICA8L29wZXJhdGlvbj4KPC9zc28+Cg==&lt;/token&gt;&lt;sign&gt;OdHV8YN0WErcCiClpaLrnUMNye1/H+3zZJce1Dv39mPxIWRTm6d3xpWarCfkt0h+mLCxfRrcoLm2X/A7g62GaxNbMPVPxiMXVuoSQaWQ6ESvOd14qU9WK/i97F+2MbrpXS/9jdpmw+zgGtud6efmbhBF3ySLlfyp1tiSmCIFfIQ=&lt;/sign&gt;&lt;/credentials&gt;\n&lt;/loginTicketResponse&gt;\n</loginCmsReturn>
</loginCmsResponse>
</soapenv:Body>
</soapenv:Envelope>
"
`