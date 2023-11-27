import { injectable } from 'inversify'
import jwt from 'jsonwebtoken'
import { camelCase } from 'lodash'
import type {
    IEncryptionServiceSignParameters,
    IEncryptionServiceVerifyParameters,
    IEncryptionService,
} from './interface'
import ObjectUtility from '@utils/object'

@injectable()
export default class EncryptionService implements IEncryptionService {
    sign(parameters: IEncryptionServiceSignParameters): string {
        const {
            payload,
            key,
            expires_in,
        } = parameters
        const signOptions = {
            expires_in,
        }
        const formattedSignOptions: jwt.SignOptions = ObjectUtility.changeCaseStyle(signOptions, (objectKey: string): string => camelCase(objectKey))
        if (expires_in) return jwt.sign(payload, key, formattedSignOptions)
        return jwt.sign(payload, key)
    }

    verify(parameters: IEncryptionServiceVerifyParameters): string | jwt.JwtPayload | jwt.Jwt {
        const {
            token,
            key,
            options,
        } = parameters
        return jwt.verify(token, key, options)
    }
}
