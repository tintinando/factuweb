import { BuildWsfeRequestProps, WsfeDetalle } from '../types';

function renderDetalle(det: WsfeDetalle): string {
  return `
    <ar:FECAEDetRequest>
      <ar:Concepto>${det.concepto}</ar:Concepto>
      <ar:DocTipo>${det.docTipo}</ar:DocTipo>
      <ar:DocNro>${det.docNro}</ar:DocNro>
      <ar:CbteDesde>${det.cbteDesde}</ar:CbteDesde>
      <ar:CbteHasta>${det.cbteHasta}</ar:CbteHasta>
      <ar:CbteFch>${det.cbteFch}</ar:CbteFch>
      <ar:ImpTotal>${det.impTotal}</ar:ImpTotal>
      <ar:ImpTotConc>${det.impTotConc}</ar:ImpTotConc>
      <ar:ImpNeto>${det.impNeto}</ar:ImpNeto>
      <ar:ImpOpEx>${det.impOpEx}</ar:ImpOpEx>
      <ar:ImpTrib>${det.impTrib}</ar:ImpTrib>
      <ar:ImpIVA>${det.impIVA}</ar:ImpIVA>
      ${
        det.fchServDesde
          ? `<ar:FchServDesde>${det.fchServDesde}</ar:FchServDesde>`
          : ''
      }
      ${
        det.fchServHasta
          ? `<ar:FchServHasta>${det.fchServHasta}</ar:FchServHasta>`
          : ''
      }
      ${
        det.fchVtoPago ? `<ar:FchVtoPago>${det.fchVtoPago}</ar:FchVtoPago>` : ''
      }
      <ar:MonId>${det.monId}</ar:MonId>
      <ar:MonCotiz>${det.monCotiz}</ar:MonCotiz>
      ${
        det.canMisMonExt
          ? `<ar:CanMisMonExt>${det.canMisMonExt}</ar:CanMisMonExt>`
          : ''
      }
      ${
        det.condicionIVAReceptorId
          ? `<ar:CondicionIVAReceptorId>${det.condicionIVAReceptorId}</ar:CondicionIVAReceptorId>`
          : ''
      }
      ${
        det.cbtesAsoc && det.cbtesAsoc.length > 0
          ? `<ar:CbtesAsoc>
              ${det.cbtesAsoc
                .map(
                  (c) => `
                <ar:CbteAsoc>
                  <ar:Tipo>${c.tipo}</ar:Tipo>
                  <ar:PtoVta>${c.ptoVta}</ar:PtoVta>
                  <ar:Nro>${c.nro}</ar:Nro>
                  ${c.cuit ? `<ar:Cuit>${c.cuit}</ar:Cuit>` : ''}
                  ${c.cbteFch ? `<ar:CbteFch>${c.cbteFch}</ar:CbteFch>` : ''}
                </ar:CbteAsoc>`
                )
                .join('')}
            </ar:CbtesAsoc>`
          : ''
      }
      ${
        det.tributos && det.tributos.length > 0
          ? `<ar:Tributos>
              ${det.tributos
                .map(
                  (t) => `
                <ar:Tributo>
                  <ar:Id>${t.id}</ar:Id>
                  ${t.desc ? `<ar:Desc>${t.desc}</ar:Desc>` : ''}
                  <ar:BaseImp>${t.baseImp}</ar:BaseImp>
                  <ar:Alic>${t.alic}</ar:Alic>
                  <ar:Importe>${t.importe}</ar:Importe>
                </ar:Tributo>`
                )
                .join('')}
            </ar:Tributos>`
          : ''
      }
      ${
        det.iva && det.iva.length > 0
          ? `<ar:Iva>
              ${det.iva
                .map(
                  (i) => `
                <ar:AlicIva>
                  <ar:Id>${i.id}</ar:Id>
                  <ar:BaseImp>${i.baseImp}</ar:BaseImp>
                  <ar:Importe>${i.importe}</ar:Importe>
                </ar:AlicIva>`
                )
                .join('')}
            </ar:Iva>`
          : ''
      }
      ${
        det.opcionales && det.opcionales.length > 0
          ? `<ar:Opcionales>
              ${det.opcionales
                .map(
                  (o) => `
                <ar:Opcional>
                  <ar:Id>${o.id}</ar:Id>
                  <ar:Valor>${o.valor}</ar:Valor>
                </ar:Opcional>`
                )
                .join('')}
            </ar:Opcionales>`
          : ''
      }
      ${
        det.compradores && det.compradores.length > 0
          ? `<ar:Compradores>
              ${det.compradores
                .map(
                  (co) => `
                <ar:Comprador>
                  <ar:DocTipo>${co.docTipo}</ar:DocTipo>
                  <ar:DocNro>${co.docNro}</ar:DocNro>
                  <ar:Porcentaje>${co.porcentaje}</ar:Porcentaje>
                </ar:Comprador>`
                )
                .join('')}
            </ar:Compradores>`
          : ''
      }
      ${
        det.periodoAsoc
          ? `<ar:PeriodoAsoc>
              <ar:FchDesde>${det.periodoAsoc.fchDesde}</ar:FchDesde>
              <ar:FchHasta>${det.periodoAsoc.fchHasta}</ar:FchHasta>
            </ar:PeriodoAsoc>`
          : ''
      }
      ${
        det.actividades && det.actividades.length > 0
          ? `<ar:Actividades>
              ${det.actividades
                .map(
                  (a) => `
                <ar:Actividad>
                  <ar:Id>${a.id}</ar:Id>
                </ar:Actividad>`
                )
                .join('')}
            </ar:Actividades>`
          : ''
      }
    </ar:FECAEDetRequest>
  `;
}

export function buildWsfeRequest({
  auth,
  header,
  detalles
}: BuildWsfeRequestProps): string {
  const cantReg = detalles.length;

  return `
    <soapenv:Envelope
      xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
      xmlns:ar="http://ar.gov.afip.dif.FEV1/"
    >
      <soapenv:Header />
      <soapenv:Body>
        <ar:FECAESolicitar>
          <ar:Auth>
            <ar:Token>${auth.token}</ar:Token>
            <ar:Sign>${auth.sign}</ar:Sign>
            <ar:Cuit>${auth.cuit}</ar:Cuit>
          </ar:Auth>
          <ar:FeCAEReq>
            <ar:FeCabReq>
              <ar:CantReg>${cantReg}</ar:CantReg>
              <ar:PtoVta>${header.ptoVenta}</ar:PtoVta>
              <ar:CbteTipo>${header.cbteTipo}</ar:CbteTipo>
            </ar:FeCabReq>
            <ar:FeDetReq>
              ${detalles.map((det) => renderDetalle(det)).join('')}
            </ar:FeDetReq>
          </ar:FeCAEReq>
        </ar:FECAESolicitar>
      </soapenv:Body>
    </soapenv:Envelope>
  `;
}
