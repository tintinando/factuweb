//------ WSFE Builder -------------
export interface WsfeAuth {
  token: string;
  sign: string;
  cuit: number | string;
}

export interface WsfeHeader {
  ptoVenta: number;
  cbteTipo: number;
}

export interface CbteAsoc {
  tipo: number;
  ptoVta: number;
  nro: number;
  cuit?: string;
  cbteFch?: string;
}

export interface Tributo {
  id: number;
  desc?: string;
  baseImp: number;
  alic: number;
  importe: number;
}

export interface AlicIva {
  id: number;
  baseImp: number;
  importe: number;
}

export interface Opcional {
  id: string;
  valor: string;
}

export interface Comprador {
  docTipo: number;
  docNro: number;
  porcentaje: number;
}

export interface WsfeDetalle {
  concepto: number;
  docTipo: number;
  docNro: number;
  cbteDesde: number;
  cbteHasta: number;
  cbteFch: string;
  impTotal: number;
  impTotConc: number;
  impNeto: number;
  impOpEx: number;
  impTrib: number;
  impIVA: number;
  fchServDesde?: string;
  fchServHasta?: string;
  fchVtoPago?: string;
  monId: string;
  monCotiz: number;
  canMisMonExt?: string;
  condicionIVAReceptorId?: number;
  cbtesAsoc?: CbteAsoc[];
  tributos?: Tributo[];
  iva?: AlicIva[];
  opcionales?: Opcional[];
  compradores?: Comprador[];
  periodoAsoc?: { fchDesde: string; fchHasta: string };
  actividades?: { id: number }[];
}

export interface BuildWsfeRequestProps {
  auth: WsfeAuth;
  header: WsfeHeader;
  detalles: WsfeDetalle[];
}

//------- WSFE response ------

interface FeCabResp {
  Cuit: number;
  PtoVta: number;
  CbteTipo: number;
  FchProceso: string;
  CantReg: number;
  Resultado: string;
  Reproceso: string;
}

interface FEDetResponse {
  Concepto: number;
  DocTipo: number;
  DocNro: number;
  CbteDesde: number;
  CbteHasta: number;
  Resultado: string;
  CAE: string;
  CbteFch: string;
  CAEFchVto: string;
  Obs: {
    Observaciones: {
      code: number;
      Msg: string;
    };
  };
}

interface ErrorItem {
  code: number;
  Msg: string;
}

export interface FECAESolicitarResponse {
  FeCabResp: FeCabResp;
  FeDetResp: {
    FEDetResponse: FEDetResponse;
  };
  Events: { Evt: ErrorItem };
  Errors: { Err: ErrorItem };
}

/*
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
*/
