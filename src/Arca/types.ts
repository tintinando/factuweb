import { Environment } from '../types/env.types';

export interface BuildLoginTicketRequestProps {
  env: Environment;
  cuit: string;
}

export interface CachedTA {
  token: string;
  sign: string;
  expirationTime: string; // ISO String retornado por AFIP
}

export interface LoginCmsResponse {
  token: string;
  sign: string;
  expirationTime: string;
}

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
