import { AfipConfig } from '../../../config/afipConfig';
import { parameters } from '../../../config/constants';
import { LoginCmsResponse } from '../../wsaa/types';
import {
  RecuperadorResponseMap,
  TipoRecuperador
} from '../types/recuperador.types';
import { buildWsfeRecuperadorRequest } from '../xmlBuilders/buildWsfeRecuperadorRequest';
import { parseWsfeRecuperador } from '../xmlParser/parseWsfeRecuperador';

interface WsfeRecuperadorProps<T extends TipoRecuperador> {
  type: T;
  auth: LoginCmsResponse;
  config: AfipConfig;
  cuit: string;
}

export async function wsfeRecuperador<T extends TipoRecuperador>({
  type,
  auth,
  config,
  cuit
}: WsfeRecuperadorProps<T>): Promise<RecuperadorResponseMap[T]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    parameters.fetchTimeout
  );

  const url = `${config.urls.wsfe}?op=${type}`;
  const soapAction = `http://ar.gov.afip.dif.FEV1/${type}`;

  console.log(soapAction);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: soapAction
      },
      body: buildWsfeRecuperadorRequest(type, auth, cuit),
      signal: controller.signal
    });

    const xml = await response.text();

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} en wsfe recuperador: ${xml}`);
    }

    return parseWsfeRecuperador(type, xml);
  } finally {
    clearTimeout(timeoutId);
  }
}
