import type { IDataSource } from './interface'
import type { IOptions } from '@features/interface'
import type { IDuty } from '@interfaces/models'

export interface IGetDutyParameters {
    id?: string,
    account_id?: string,
    name?: string,
}

export interface IQueryDutyParameters {
    id?: string,
    name?: string,
}

export interface IDeleteDutyParameters {
    id: string,
}

export interface IDutyDataSource extends IDataSource {
    create: (parameters: Partial<IDuty>, options?: IOptions) => Promise<IDuty>,
    get: (parameters?: IGetDutyParameters, options?: IOptions) => Promise<IDuty[]>,
    update: (parameters: Partial<IDuty>, queryParameters: IQueryDutyParameters, options?: IOptions) => Promise<IDuty>,
    delete: (parameters: IDeleteDutyParameters, options?: IOptions) => Promise<IDuty>,
}
