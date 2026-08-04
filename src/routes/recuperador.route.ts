import { Hono } from 'hono';
import { Env } from '../types/env.types';
import { afipConfig } from '../config/afipConfig';
import { LoginCmsResponse } from '../Arca/wsaa/types';
import { getCachedArcaTA } from '../Arca/wsaa/service/getCachedArcaTa';
import { wsfeRecuperador } from '../Arca/wsfe/service/recuperador';
import { TipoRecuperador } from '../Arca/wsfe/types/recuperador.types';

export const wsfeRecuperadorRoute = new Hono<Env>();

const tiposRecuperador = [
  'FEParamGetTiposCbte',
  'FEParamGetTiposConcepto',
  'FEParamGetTiposDoc',
  'FEParamGetTiposIva',
  'FEParamGetTiposMonedas',
  'FEParamGetTiposOpcional',
  'FEParamGetTiposTributos',
  'FEParamGetPtosVenta',
  'FEParamGetCotizacion'
] as const;

function isTipoRecuperador(value: string): value is TipoRecuperador {
  return tiposRecuperador.includes(value as TipoRecuperador);
}

wsfeRecuperadorRoute.get('/', async (c) => {
  const cache = c.env.AFIP_CACHE;
  const config = afipConfig(c);

  const type = c.req.query('op');
  const cuit = c.req.query('cuit');

  if (!type || !isTipoRecuperador(type)) {
    return c.json({ error: 'Parametro op inválido' }, 400);
  }

  if (!cuit) {
    return c.json({ error: 'Falta parámetro cuit' }, 400);
  }

  try {
    const ticket: LoginCmsResponse = await getCachedArcaTA({ cache, config });

    const response = await wsfeRecuperador({
      type,
      auth: ticket,
      config,
      cuit
    });

    return c.json(response);
  } catch (e) {
    return c.text(`Error ${e}`, 500);
  }
});
