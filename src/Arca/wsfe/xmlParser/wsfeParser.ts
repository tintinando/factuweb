import { XMLParser } from 'fast-xml-parser';
import { FECAESolicitarResponse } from '../types';

export function parseFECAEResponse(xml: string): FECAESolicitarResponse {
  const parser = new XMLParser({
    ignoreAttributes: true,
    trimValues: true,
    removeNSPrefix: true
  });

  return parser.parse(xml);
}

/*  <soap:Envelope
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:ar="http://ar.gov.afip.dif.fev1/"
  >
    <soap:Header />
    <soap:Body>
      <FECAESolicitarResponse>
        <FECAESolicitarResult>
          <FeCabResp>
            <Cuit>long</Cuit>
            <PtoVta>int</PtoVta>
            <CbteTipo>int</CbteTipo>
            <FchProceso>string</FchProceso>
            <CantReg>int</CantReg>
            <Resultado>string</Resultado>
            <Reproceso>string</Reproceso>
          </FeCabResp>
          <FeDetResp>
            <FEDetResponse>
              <Concepto>int</Concepto>
              <DocTipo>int</DocTipo>
              <DocNro>long</DocNro>
              <CbteDesde>long</CbteDesde>
              <CbteHasta>long</CbteHasta>
              <Resultado>string</Resultado>
              <CAE>string</CAE>
              <CbteFch>string</CbteFch>
              <CAEFchVto>string</CAEFchVto>
              <Obs>
                <Observaciones>
                  <code>int</code>
                  <Msg>string</Msg>
                </Observaciones>
              </Obs>
            </FEDetResponse>
          </FeDetResp>
          <Events>
            <Evt>
              <code>int</code>
              <Msg>string</Msg>
            </Evt>
          </Events>
          <Errors>
            <Err>
              <code>int</code>
              <Msg>string</Msg>
            </Err>
          </Errors>
        </FECAESolicitarResult>
      </FECAESolicitarResponse>
    </soap:Body>
  </soap:Envelope>
`;
*/

/*
Envelope: {
    Header: '',
    Body: {
      FECAESolicitarResponse: {
        FECAESolicitarResult: {
          FeCabResp: {
            Cuit: 'long',
            PtoVta: 'int',
            CbteTipo: 'int',
            FchProceso: 'string',
            CantReg: 'int',
            Resultado: 'string',
            Reproceso: 'string'
          },
          FeDetResp: {
            FEDetResponse: {
              Concepto: 'int',
              DocTipo: 'int',
              DocNro: 'long',
              CbteDesde: 'long',
              CbteHasta: 'long',
              Resultado: 'string',
              CAE: 'string',
              CbteFch: 'string',
              CAEFchVto: 'string',
              Obs: { Observaciones: { code: 'int', Msg: 'string' } }
            }
          },
          Events: { Evt: { code: 'int', Msg: 'string' } },
          Errors: { Err: { code: 'int', Msg: 'string' } }
        }
      }
    }
  }
};
*/
