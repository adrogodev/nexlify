export interface AuthConfig {
    tokenProvider?: () => Promise<Nullable<string>> | Nullable<string>
    tokenHeader?: string;
    tokenPrefix?: string;
}
