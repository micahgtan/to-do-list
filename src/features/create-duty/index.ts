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
import type { IIdService } from '@services/id/interface'
import AbstractFeature from '@features/abstract'
import Types from '@src/types'
import SystemError from '@utils/system-error'
import schema from './schema'

@injectable()
export default class CreateDuty extends AbstractFeature<IParameters, IResponse> {
    constructor(
        @inject(Types.AccountDataSource) private readonly accountDataSource: Pick<IAccountDataSource, 'get'>,
        @inject(Types.IdService) private readonly idService: Pick<IIdService, 'generate'>,
        @inject(Types.DutyDataSource) private readonly dutyDataSource: Pick<IDutyDataSource, 'create' | 'get'>,
    ) {
        super(schema)
    }

    async process(parameters: IParameters, options?: IOptions): IResponse {
        const {
            account_id,
            name,
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
            name,
        }, {
            transaction,
        })
        if (duty) throw new SystemError({
            code: 'UniqueConstraintError',
            message: 'Duty record already exists',
        })
        const createdDuty = await this.dutyDataSource.create({
            id: this.idService.generate(),
            ...parameters,
        })
        return createdDuty
    }
}
