import {
    inject,
    injectable,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IOptions } from '../interface'
import type { IAccountDataSource } from '@interfaces/data-sources'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import SystemError from '@utils/system-error'
import schema from './schema'

@injectable()
export default class DeleteAccount extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.AccountDataSource) private readonly accountDataSource: Pick<IAccountDataSource, 'get' | 'delete'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            id,
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
        const deletedAccount = await this.accountDataSource.delete({
            id,
        }, {
            transaction,
        })
        return deletedAccount
    }
}
