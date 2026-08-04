export type TipoRecuperador =
  | 'FEParamGetTiposCbte'
  | 'FEParamGetTiposConcepto'
  | 'FEParamGetTiposDoc'
  | 'FEParamGetTiposIva'
  | 'FEParamGetTiposMonedas'
  | 'FEParamGetTiposOpcional'
  | 'FEParamGetTiposTributos'
  | 'FEParamGetPtosVenta'
  | 'FEParamGetCotizacion';

interface ErrorItem {
  code: number;
  Msg: string;
}

// ------ Tipos Cbte -------
interface CbteTipo {
  Id: number;
  Desc: string;
  FchDesde: string;
  FchHasta: string;
}

interface TiposCbteResponse {
  ResultGet: {
    CbteTipo: CbteTipo[];
  };
  Errors: {
    Err: ErrorItem[];
  };
  Events: {
    Evt: ErrorItem[];
  };
}

// ------ Tipos Concepto -------
interface TiposConceptoResponse {
  ResultGet: {
    ConceptoTipo: CbteTipo[];
  };
  Errors: {
    Err: ErrorItem[];
  };
  Events: {
    Evt: ErrorItem[];
  };
}

type TiposDocResponse = any;
type TiposIvaResponse = any;
type TiposMonedasResponse = any;
type TiposOpcionalResponse = any;
type TiposTributosResponse = any;
type PuntosVentaResponse = any;
type CotizacionResponse = any;

export type RecuperadorResponseMap = {
  FEParamGetTiposCbte: TiposCbteResponse;
  FEParamGetTiposConcepto: TiposConceptoResponse;
  FEParamGetTiposDoc: TiposDocResponse;
  FEParamGetTiposIva: TiposIvaResponse;
  FEParamGetTiposMonedas: TiposMonedasResponse;
  FEParamGetTiposOpcional: TiposOpcionalResponse;
  FEParamGetTiposTributos: TiposTributosResponse;
  FEParamGetPtosVenta: PuntosVentaResponse;
  FEParamGetCotizacion: CotizacionResponse;
};
