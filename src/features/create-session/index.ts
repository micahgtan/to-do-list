import config from 'config'
import {
    injectable,
    inject,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IOptions } from '../interface'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IEncryptionService } from '@services/encryption/interface'
import type { IHashService } from '@services/hash/interface'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import SystemError from '@utils/system-error'
import schema from './schema'

const JWT_SECRET: string = config.get('app.jwt.secret')
const JWT_ACCESS_TOKEN_EXPIRES_IN: string = config.get('app.jwt.access_token_expires_in')
const JWT_REFRESH_TOKEN_EXPIRES_IN: string = config.get('app.jwt.refresh_token_expires_in')

@injectable()
export default class CreateSession extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.AccountDataSource) private readonly accountDataSource: Pick<IAccountDataSource, 'get'>,
        @inject(Types.EncryptionService) private readonly jwtService: Pick<IEncryptionService, 'sign'>,
        @inject(Types.HashService) private readonly hashService: Pick<IHashService, 'compare'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            username,
            password,
        } = parameters
        const {
            transaction,
        } = {
            ...options,
        }
        const [account] = await this.accountDataSource.get({
            username,
        }, {
            transaction,
        })
        if (!account) throw new SystemError({
            code: 'AuthenticationError',
            message: 'Invalid username or password',
        })
        const comparedPassword = await this.hashService.compare({
            data: password,
            hash: account.password,
        })
        if (!comparedPassword) throw new SystemError({
            code: 'AuthenticationError',
            message: 'Invalid username or password',
        })
        const jwtSignAccessTokenParameters = {
            payload: {
                username: account.username,
            },
            key: JWT_SECRET,
            expires_in: JWT_ACCESS_TOKEN_EXPIRES_IN,
        }
        const jwtAccessToken = this.jwtService.sign(jwtSignAccessTokenParameters)
        const jwtSignRefreshTokenParameters = {
            ...jwtSignAccessTokenParameters,
            expires_in: JWT_REFRESH_TOKEN_EXPIRES_IN,
        }
        const jwtRefreshToken = this.jwtService.sign(jwtSignRefreshTokenParameters)
        return {
            access_token: jwtAccessToken,
            access_token_expires_in: JWT_ACCESS_TOKEN_EXPIRES_IN,
            refresh_token: jwtRefreshToken,
            refresh_token_expires_in: JWT_REFRESH_TOKEN_EXPIRES_IN,
            token_type: 'Bearer',
        }
    }
}
