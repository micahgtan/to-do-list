import type { IDataSource } from './interface'
import type { IOptions } from '@features/interface'
import type { IAccount } from '@interfaces/models'

export interface IGetAccountParameters {
    id?: string,
    email_address?: string,
    username?: string,
}

export interface IQueryAccountParameters {
    id?: string,
}

export interface IDeleteAccountParameters {
    id: string,
}

export interface IAccountDataSource extends IDataSource {
    create: (parameters: Partial<IAccount>, options?: IOptions) => Promise<IAccount>,
    get: (parameters?: IGetAccountParameters, options?: IOptions) => Promise<IAccount[]>,
    update: (parameters: Partial<IAccount>, queryParameters: IQueryAccountParameters, options?: IOptions) => Promise<IAccount>,
    delete: (parameters: IDeleteAccountParameters, options?: IOptions) => Promise<IAccount>,
}
