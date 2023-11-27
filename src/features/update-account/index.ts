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
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import SystemError from '@utils/system-error'
import schema from './schema'

const BCRYPT_SALT_ROUNDS: number = config.get('app.bcrypt.salt_rounds')

@injectable()
export default class UpdateAccount extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.AccountDataSource) private readonly accountDataSource: Pick<IAccountDataSource, 'get' | 'update'>,
        @inject(Types.HashService) private readonly hashService: Pick<IHashService, 'hash'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            id,
            password,
        } = parameters
        const {
            transaction,
        } = {
            ...options,
        }
        const [account] = await this.accountDataSource.get({
            id,
        }, {
            transaction,
        })
        if (!account) throw new SystemError({
            code: 'NoDataFoundError',
            message: 'Account record does not exist',
        })
        const updateParameters = {
            ...parameters,
        }
        if (password) updateParameters.password = await this.hashService.hash({
            data: password,
            salt_rounds: BCRYPT_SALT_ROUNDS,
        })
        const updatedAccount = await this.accountDataSource.update(updateParameters, {
            id,
        }, {
            transaction,
            for_update: true,
        })
        return updatedAccount
    }
}
