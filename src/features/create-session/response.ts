export interface IJwtAuthenticationResponse {
    access_token: string,
    access_token_expires_in: string,
    refresh_token: string,
    refresh_token_expires_in: string,
    token_type: string,
}

export type IResponse = Promise<IJwtAuthenticationResponse>
