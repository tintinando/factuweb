import { formatDate } from "../../helpers/datetime"
import crypto from "node:crypto"
import { BuildLoginTicketRequestProps } from "../../types/arca.types"

export function buildLoginTicketRequest({ env, cuit }: BuildLoginTicketRequestProps): string {
    const uniqueId = crypto.getRandomValues(new Uint32Array(1))[0]

    const now = new Date()
    const plus12 = new Date(now.getTime() + 12 * 60 * 60 * 1000)

    return `<?xml version="1.0" encoding="UTF-8"?>
    <loginTicketRequest version="1.0">
    <header>
        <destination>cn=${env === 'testing' ? 'wsaahomo' : 'wsaa'},o=afip,c=ar,serialNumber=CUIT ${cuit}</destination>
        <uniqueId>${uniqueId}</uniqueId>
        <generationTime>${formatDate(now)}</generationTime>
        <expirationTime>${formatDate(plus12)}</expirationTime>
    </header>
    <service>wsfe</service>
    </loginTicketRequest>
    `
}
