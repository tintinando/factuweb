import { XMLParser } from 'fast-xml-parser'

export function parseXML(xml: string): string {
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_"
    })

    const obj = parser.parse(xml)
    return obj
}
