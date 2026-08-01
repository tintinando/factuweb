import { Hono } from 'hono';
import { Env } from '../types/env.types';
import { afipConfig } from '../config/afipConfig';
import { getCachedArcaTA } from '../Arca/service/getCachedArcaTa';
import { LoginCmsResponse } from '../Arca/types';

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
