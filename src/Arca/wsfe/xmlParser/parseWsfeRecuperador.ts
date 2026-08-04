import { XMLParser } from 'fast-xml-parser';
import {
  RecuperadorResponseMap,
  TipoRecuperador
} from '../types/recuperador.types';

const parser = new XMLParser({
  ignoreAttributes: true,
  trimValues: true,
  removeNSPrefix: true
});

function parseTiposCbte(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetTiposCbteResponse
    .FEParamGetTiposCbteResult;
}

function parseTiposConcepto(xml: string) {
  const parsedXml = parser.parse(xml);

  return parsedXml.Envelope.Body.FEParamGetTiposConceptoResponse
    .FEParamGetTiposConceptoResult;
}

function parseTiposDoc(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetTiposDocResponse
    .FEParamGetTiposDocResult;
}

function parseTiposIva(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetTiposIvaResponse
    .FEParamGetTiposIvaResult;
}

function parseTiposMonedas(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetTiposMonedasResponse
    .FEParamGetTiposMonedasResult;
}

function parseTiposOpcional(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetTiposOpcionalResponse
    .FEParamGetTiposOpcionalResult;
}

function parseTiposTributos(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetTiposTributosResponse
    .FEParamGetTiposTributosResult;
}

function parsePuntosVenta(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetPtosVentaResponse
    .FEParamGetPtosVentaResult;
}

function parseCotizacion(xml: string) {
  const parsedXml = parser.parse(xml);
  return parsedXml.Envelope.Body.FEParamGetCotizacionResponse
    .FEParamGetCotizacionResult;
}

export function parseWsfeRecuperador<T extends TipoRecuperador>(
  type: T,
  xml: string
): RecuperadorResponseMap[T] {
  switch (type) {
    case 'FEParamGetTiposCbte':
      return parseTiposCbte(xml);
    case 'FEParamGetTiposConcepto':
      return parseTiposConcepto(xml);
    case 'FEParamGetTiposDoc':
      return parseTiposDoc(xml);
    case 'FEParamGetTiposIva':
      return parseTiposIva(xml);
    case 'FEParamGetTiposMonedas':
      return parseTiposMonedas(xml);
    case 'FEParamGetTiposOpcional':
      return parseTiposOpcional(xml);
    case 'FEParamGetTiposTributos':
      return parseTiposTributos(xml);
    case 'FEParamGetPtosVenta':
      return parsePuntosVenta(xml);
    case 'FEParamGetCotizacion':
      return parseCotizacion(xml);
  }
}
