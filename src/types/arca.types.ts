import { Environment } from "./env.types";

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