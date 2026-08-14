import { Hono } from "hono";
import { Env } from "../types/env.types";
import { afipConfig } from "../config/afipConfig";
import { obtenerCAE } from "../Arca/wsfe/service/obtenerCAE";
import { WsfeDetalle, WsfeHeader } from "../Arca/wsfe/types/types";
import { getCachedArcaTA } from "../Arca/wsaa/service/getCachedArcaTa";

export const solicitarCAE = new Hono<Env>();

solicitarCAE.get("/", async (c) => {
  const cache = c.env.AFIP_CACHE;
  const config = afipConfig(c);

  const auth = await getCachedArcaTA({
    cache,
    config,
  });

  const header: WsfeHeader = {
    ptoVenta: 0,
    cbteTipo: 0,
  };

  const detalles: WsfeDetalle[] = [
    {
      concepto: 0,
      docTipo: 1,
      docNro: 123456789,
      cbteDesde: 1,
      cbteHasta: 1,
      cbteFch: "",
      impTotal: 121,
      impTotConc: 121,
      impNeto: 100,
      impOpEx: 0,
      impTrib: 0,
      impIVA: 21,
      fchServDesde: "",
      fchServHasta: "",
      fchVtoPago: "",
      monId: "",
      monCotiz: 0,
      canMisMonExt: "",
      condicionIVAReceptorId: 0,
      cbtesAsoc: [],
      tributos: [],
      iva: [],
      opcionales: [],
      compradores: [],
      periodoAsoc: {
        fchDesde: "",
        fchHasta: "",
      },
      actividades: [
        {
          id: 0,
        },
      ],
    },
  ];

  try {
    const CAE = await obtenerCAE({ auth, config, header, detalles });

    return c.json(CAE);
  } catch (e) {
    return c.text(`Error ${e}`);
  }
});
