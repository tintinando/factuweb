export function buildWsfeEnvelope(xml: string): string {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
      <soapenv:Header />
      <soapenv:Body>
        ${xml}
      </soapenv:Body>
    </soapenv:Envelope>`;
}
