import { LoginCmsResponse } from '../../wsaa/types';
import { TipoRecuperador } from '../types/recuperador.types';

export function buildWsfeRecuperadorRequest(
  type: TipoRecuperador,
  auth: LoginCmsResponse,
  cuit: string
): string {
  return `
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ar="http://ar.gov.afip.dif.FEV1/">
      <soapenv:Header />
      <soapenv:Body>
        <ar:${type}>
          <ar:Auth>
            <ar:Token>${auth.token}</ar:Token>
            <ar:Sign>${auth.sign}</ar:Sign>
            <ar:Cuit>${cuit}</ar:Cuit>
          </ar:Auth>
        </ar:${type}>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
}
