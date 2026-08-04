import { Hono } from 'hono';
import { Env } from '../types/env.types';
import { afipConfig } from '../config/afipConfig';
import { LoginCmsResponse } from '../Arca/wsaa/types';
import { getCachedArcaTA } from '../Arca/wsaa/service/getCachedArcaTa';

export const auth = new Hono<Env>();

auth.get('/', async (c) => {
  const cache = c.env.AFIP_CACHE;
  const config = afipConfig(c);

  try {
    const ticket: LoginCmsResponse = await getCachedArcaTA({ cache, config });

    return c.json(ticket);
  } catch (e) {
    return c.text(`Error ${e}`);
  }
});
