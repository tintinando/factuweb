import forge from "node-forge";

export interface SignCmsProps {
    xml: string;
    certificatePem: string;
    privateKeyPem: string;
}

export function signCms({
    xml,
    certificatePem,
    privateKeyPem,
}: SignCmsProps): string {
    const cert = forge.pki.certificateFromPem(certificatePem);
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);

    const p7 = forge.pkcs7.createSignedData();

    // Contenido del CMS
    p7.content = forge.util.createBuffer(xml, "utf8");

    // Incluir el certificado
    p7.addCertificate(cert);

    // Firmante
    p7.addSigner({
        key: privateKey,
        certificate: cert,
        digestAlgorithm: forge.pki.oids.sha256,
        authenticatedAttributes: [
            {
                type: forge.pki.oids.contentType,
                value: forge.pki.oids.data,
            },
            {
                type: forge.pki.oids.messageDigest,
            },
            {
                type: forge.pki.oids.signingTime,
                value: new Date() as unknown as string,
            },
        ],
    });

    // Firma embebida (no detached)
    p7.sign({ detached: false });

    // DER -> Base64
    const der = forge.asn1.toDer(p7.toAsn1()).getBytes();
    const base64 = forge.util.encode64(der)

    return base64.replace(/[\r\n]/g, "");
}