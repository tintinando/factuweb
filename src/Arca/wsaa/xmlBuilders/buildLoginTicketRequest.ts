import crypto from "node:crypto";
import { formatDate } from "../../../helpers/datetime";
import { BuildLoginTicketRequestProps } from "../types";

export function buildLoginTicketRequest({ env }: BuildLoginTicketRequestProps): string {
  const uniqueId = crypto.getRandomValues(new Uint32Array(1))[0];

  const now = new Date();
  const plus12 = new Date(now.getTime() + 12 * 60 * 60 * 1000);

  const destination =
    env === "testing"
      ? "cn=wsaahomo, o=afip, c=ar, serialNumber=CUIT 33693450239"
      : "cn=wsaa, o=afip, c=ar, serialNumber=CUIT 33693450239";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <loginTicketRequest version="1.0">
      <header>
        <destination>${destination}</destination>
        <uniqueId>${uniqueId}</uniqueId>
        <generationTime>${formatDate(now)}</generationTime>
        <expirationTime>${formatDate(plus12)}</expirationTime>
      </header>
      <service>wsfe</service>
    </loginTicketRequest> `;

  return xml;
}
