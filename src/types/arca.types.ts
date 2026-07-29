export type Environment = 'testing' | 'production'

export function isEnvironment(value: string): value is Environment {
    return value === "testing" || value === "production";
}

export interface BuildLoginTicketRequestProps {
    env: Environment
    cuit: string
}

export interface CachedTA {
    token: string;
    sign: string;
    expirationTime: string; // ISO String retornado por AFIP
}

export interface LoginCmsResponse {
    token: string
    sign: string
    expirationTime: string
}