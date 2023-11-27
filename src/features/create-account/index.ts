import config from 'config'
import {
    inject,
    injectable,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IOptions } from '../interface'
import type { IAccountDataSource } from '@interfaces/data-sources'
import type { IHashService } from '@services/hash/interface'
import type { IIdService } from '@services/id/interface'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import SystemError from '@utils/system-error'
import schema from './schema'

const BCRYPT_SALT_ROUNDS: number = config.get('app.bcrypt.salt_rounds')

@injectable()
export default class CreateAccount extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.AccountDataSource) private readonly accountDataSource: Pick<IAccountDataSource, 'create' | 'get'>,
        @inject(Types.HashService) private readonly hashService: Pick<IHashService, 'hash'>,
        @inject(Types.IdService) private readonly idService: Pick<IIdService, 'generate'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            email_address,
            username,
            password,
        } = parameters
        const {
            transaction,
        } = {
            ...options,
        }
        const [account] = await this.accountDataSource.get({
            email_address,
            username,
        }, {
            transaction,
        })
        if (account) throw new SystemError({
            code: 'UniqueConstraintError',
            message: 'Account record already exists',
        })
        const hashedPassword = await this.hashService.hash({
            data: password,
            salt_rounds: BCRYPT_SALT_ROUNDS,
        })
        const createdAccount = await this.accountDataSource.create({
            ...parameters,
            id: this.idService.generate(),
            password: hashedPassword,
        })
        return createdAccount
    }
}
