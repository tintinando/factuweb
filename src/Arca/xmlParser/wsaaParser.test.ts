import { describe, expect, test } from '@jest/globals';
import { parseLoginCmsResult } from './wsaaParser';

const SUCCESS_XML = /* HTML */ `<soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <soapenv:Body>
    <loginCmsResponse xmlns="http://wsaa.view.sua.dvadac.desein.afip.gov">
      <loginCmsReturn
        ><![CDATA[<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
        <loginTicketResponse version="1.0"> <header> <source>CN=wsaahomo,
        O=AFIP, C=AR, SERIALNUMBER=CUIT 33693450239</source>
        <destination>SERIALNUMBER=CUIT 20308031382, CN=martin</destination>
        <uniqueId>3104679700</uniqueId>
        <generationTime>2026-07-27T00:12:34.261-03:00</generationTime>
        <expirationTime>2026-07-27T12:12:34.261-03:00</expirationTime> </header>
        <credentials> <token>myBeautifulToken</token> <sign>myAwfulSign</sign>
        </credentials> </loginTicketResponse>]]>
      </loginCmsReturn>
    </loginCmsResponse>
  </soapenv:Body>
</soapenv:Envelope>`;

const FAULT_XML = /* HTML */ ` <soapenv:Envelope
  xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
  xmlns:xsd="http://www.w3.org/2001/XMLSchema"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
>
  <soapenv:Body>
    <soapenv:Fault>
      <faultcode xmlns:ns1="http://xml.apache.org/axis/">ns1:cms.bad</faultcode>
      <faultstring>El CMS no es valido</faultstring>
      <detail>
        <ns2:exceptionName xmlns:ns2="http://xml.apache.org/axis/"
          >gov.afip.desein.dvadac.sua.view.wsaa.LoginFault</ns2:exceptionName
        >
        <ns3:hostname xmlns:ns3="http://xml.apache.org/axis/"
          >wsaaext0.homo.afip.gov.ar</ns3:hostname
        >
      </detail>
    </soapenv:Fault>
  </soapenv:Body>
</soapenv:Envelope>`;

describe('parseLoginCmsResult', () => {
  test('debe extraer el token y el sign correctamente de una respuesta exitosa', () => {
    const result = parseLoginCmsResult(SUCCESS_XML);

    expect(result).toEqual({
      token: 'myBeautifulToken',
      sign: 'myAwfulSign'
    });
  });

  test('debe lanzar una excepción con el faultstring si AFIP devuelve un SOAP Fault', () => {
    expect(() => parseLoginCmsResult(FAULT_XML)).toThrow(
      'Error en la respuesta SOAP: El CMS no es valido'
    );
  });

  test('debe lanzar error si el XML ingresado no es válido o carece de la estructura SOAP', () => {
    const invalidXml = '<invalid>XML</invalid>';

    expect(() => parseLoginCmsResult(invalidXml)).toThrow(
      'Estructura de respuesta del SOAP inválida'
    );
  });
});
