import type { IAccount } from './account'

export interface IDuty {
    id: string,
    account_id: string,
    account?: IAccount,
    name: string,
    created_at: string,
    updated_at: string,
}
