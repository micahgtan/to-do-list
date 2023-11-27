import type jwt from 'jsonwebtoken'

export interface IEncryptionServiceSignParameters {
    payload: string | object | Buffer,
    key: jwt.Secret,
    expires_in?: string | number,
}

export interface IEncryptionServiceVerifyParameters {
    token: string,
    key: jwt.Secret,
    options?: jwt.VerifyOptions,
}

export interface IEncryptionService {
    sign: (parameters: IEncryptionServiceSignParameters) => string,
    verify: (parameters: IEncryptionServiceVerifyParameters) => string | jwt.JwtPayload | jwt.Jwt,
}
