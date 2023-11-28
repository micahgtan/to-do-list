import {
    inject,
    injectable,
} from 'inversify'
import type { IParameters } from './parameters'
import type { IResponse } from './response'
import type { IOptions } from '../interface'
import type {
    IAccountDataSource,
    IDutyDataSource,
} from '@interfaces/data-sources'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import SystemError from '@utils/system-error'
import schema from './schema'

@injectable()
export default class UpdateDuty extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.AccountDataSource) private readonly accountDataSource: Pick<IAccountDataSource, 'get'>,
        @inject(Types.DutyDataSource) private readonly dutyDataSource: Pick<IDutyDataSource, 'get' | 'update'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            id,
            account_id,
        } = parameters
        const {
            transaction,
        } = {
            ...options,
        }
        const [account] = await this.accountDataSource.get({
            id: account_id,
        }, {
            transaction,
        })
        if (!account) throw new SystemError({
            code: 'NoDataFoundError',
            message: 'Account record does not exist',
        })
        const [duty] = await this.dutyDataSource.get({
            id,
        }, {
            transaction,
        })
        if (!duty) throw new SystemError({
            code: 'NoDataFoundError',
            message: 'Duty record does not exist',
        })
        const updatedDuty = await this.dutyDataSource.update({
            ...parameters,
        }, {
            id,
        }, {
            transaction,
            for_update: true,
        })
        return updatedDuty
    }
}
