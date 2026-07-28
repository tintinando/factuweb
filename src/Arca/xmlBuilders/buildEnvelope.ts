export const envelope = (cmsBase64: string): string =>
    `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:wsaa="http://wsaa.view.sua.dvadac.desein.afip.gov">
    <soapenv:Header/>
        <soapenv:Body>
            <wsaa:loginCms>
                <wsaa:in0>
                    ${cmsBase64}
                </wsaa:in0>
            </wsaa:loginCms>
        </soapenv:Body>
    </soapenv:Envelope>`