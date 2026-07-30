export type Environment = 'testing' | 'production'

export function isEnvironment(value: string): value is Environment {
    return value === "testing" || value === "production";
}

export type Bindings = {
    AFIP_CACHE: KVNamespace;
    ENVIRONMENT: string
    AFIP_PRODUCTION_PEM: string
    AFIP_PRODUCTION_CUIT: string
    AFIP_PRODUCTION_KEY: string
    AFIP_TESTING_PEM: string
    AFIP_TESTING_CUIT: string
    AFIP_TESTING_KEY: string
    API_TOKEN: string
}

export type Env = {
    Bindings: Bindings
}